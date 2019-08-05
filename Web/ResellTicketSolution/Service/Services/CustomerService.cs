using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SendGrid;
using SendGrid.Helpers.Mail;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using ViewModel.AppSetting;
using ViewModel.ViewModel.Customer;
using ViewModel.ViewModel.Transaction;
using ViewModel.ViewModel.CreditCard;

namespace Service.Services
{
    public interface ICustomerService
    {
        void Logout(string username, string deviceId);
        bool CreateCustomer(CustomerRegisterViewModel model);
        string ViewAccountConnect(string username);
        string AddAccountStripeToReceiveMoney(string usename, string accountId);
        string HashPassword(string password, byte[] salt);
        CustomerDataTable GetCutomers(string param, int page, int pageSize);
        CustomerRowViewModel FindCustomerById(int id);
        string UpdateCustomerAuthen(CustomerRowViewModel model);
        //update profile phía client
        string UpdateCustomerPofile(CustomerRowViewModel model);
        bool CheckIsExistedPhoneNumber(string phoneNumber);
        bool CheckIsExistedConnectBankAccount(string username);
        CustomerRowViewModel FindCustomerByUsername(string usename);
        CustomerRowViewModel GetCustomerDetail(string username);

        /// <summary>
        /// Send OTP for customer when customer forgot password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        string SendOTPForgotPassword(CustomerForgotPasswordViewModel model);

        /// <summary>
        /// Use when customer received OTP when forgot password
        /// </summary>
        /// <param name="customerChangePasswordWithOTPConfirm"></param>
        /// <returns></returns>
        string ChangePasswordWithOTPConfirm(CustomerChangePasswordWithOTPConfirm customerChangePasswordWithOTPConfirm);
        string ChangePasswordWithNoOTPConfirm(CustomerChangePasswordViewModel model);

        List<TransactionDataTable> GetTransactions(string username, int page, int pageSize);
    }

    public class CustomerService : ICustomerService
    {
        private const string API_URL = "https://connect.stripe.com/oauth/token";
        public const string ERROR_NOT_FOUND_CUSTOMER = "Not found customer.";
        public const string ERROR_INVALID_OTP = "Invalid OTP.";
        public const string ERROR_INVALID_PASSWORD = "Invalid Password.";
        public const string ERROR_EXISTED_ACCOUNT_BANK = "Customer have already account bank.";

        private readonly ICustomerRepository _customerRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IPayoutRepository _payoutRepository;
        private readonly IRefundRepository _refundRepository;
        private readonly ICreditCardRepository _creditCardRepository;
        private readonly IOTPRepository _oTPRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;
        private readonly IOTPService _oTPService;
        private readonly ICustomerDeviceRepository _customerDeviceRepository;


        public CustomerService(ICustomerRepository customerRepository,
            IOTPRepository oTPRepository,
            IPaymentRepository paymentRepository,
            IPayoutRepository payoutRepository,
            IRefundRepository refundRepository,
            ICreditCardRepository creditCardRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IOTPService oTPService,
            IOptions<CrediCardSetting> options,
            ICustomerDeviceRepository customerDeviceRepository)
        {
            _customerRepository = customerRepository;
            _paymentRepository = paymentRepository;
            _payoutRepository = payoutRepository;
            _refundRepository = refundRepository;
            _creditCardRepository = creditCardRepository;
            _oTPRepository = oTPRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _oTPService = oTPService;
            SETTING = options;
            _customerDeviceRepository = customerDeviceRepository;
        }

        public bool CreateCustomer(CustomerRegisterViewModel model)
        {
            var customer = _mapper.Map<CustomerRegisterViewModel, Core.Models.Customer>(model); //map từ ViewModel qua Model

            if ((_customerRepository.Get(x => x.Username.Equals(model.Username, StringComparison.Ordinal)) == null) &&
                    _oTPRepository.Get(x => x.PhoneNo.Equals(model.PhoneNumber) &&
                    x.Code.Equals(model.OTPNumber) && x.ExpiredAtUTC > DateTime.UtcNow) != null)
            {
                byte[] salt = new byte[128 / 8];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(salt);
                }
                //Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");
                customer.PasswordHash = HashPassword(customer.PasswordHash, salt);
                customer.SaltPasswordHash = Convert.ToBase64String(salt);
                customer.CreatedAtUTC = DateTime.UtcNow;
                customer.UpdatedAtUTC = DateTime.UtcNow;
                customer.IsActive = true;
                _customerRepository.Add(customer);
                _unitOfWork.CommitChanges();

                return true;
            }
            return false;
        }

        public string HashPassword(string password, byte[] salt)
        {
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashed;
        }

        //string orderBy, string param
        public CustomerDataTable GetCutomers(string param, int page, int pageSize)
        {
            param = param ?? "";
            var customers = _customerRepository.GetAllQueryable()
                            .Where(x => x.Username.Contains(param)
                            || x.FullName.ToLower().Contains(param.ToLower())
                            || x.Email.ToLower().Contains(param.ToLower())
                            || x.PhoneNumber.Contains(param))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var totalCustomers = _customerRepository.GetAllQueryable()
                            .Where(x => x.Username.Contains(param)
                            || x.FullName.ToLower().Contains(param.ToLower())
                            || x.Email.ToLower().Contains(param.ToLower())
                            || x.PhoneNumber.Contains(param)).Count();
            var customerRowViewModels = _mapper.Map<List<Core.Models.Customer>, List<CustomerRowViewModel>>(customers);

            var customerDataTable = new CustomerDataTable()
            {
                Data = customerRowViewModels,
                Total = totalCustomers
            };
            return customerDataTable;
        }

        public CustomerRowViewModel FindCustomerById(int id)
        {
            var customer = _customerRepository.Get(x => x.Id == id);
            var customerRowViewModel = _mapper.Map<Core.Models.Customer, CustomerRowViewModel>(customer);
            return customerRowViewModel;
        }

        public string UpdateCustomerAuthen(CustomerRowViewModel model)
        {
            var existedCustomer = _customerRepository.Get(x => x.Id == model.Id);
            if (existedCustomer == null)
            {
                return "Not found customer";
            }

            existedCustomer.IsActive = model.IsActive;
            _customerRepository.Update(existedCustomer);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
        }

        public bool CheckIsExistedPhoneNumber(string phoneNumber)
        {
            if (_customerRepository.Get(x => x.PhoneNumber.Equals(phoneNumber)) == null)
            {
                return true;
            }

            return false;
        }

        public string SendOTPForgotPassword(CustomerForgotPasswordViewModel model)
        {
            var existedCustomer = _customerRepository.Get(x =>
                x.Deleted == false &&
                x.PhoneNumber == model.PhoneNumber
            );

            if (existedCustomer == null)
            {
                return ERROR_NOT_FOUND_CUSTOMER;
            }
            _oTPService.CreatOTPWithEachPhone(model.PhoneNumber);

            return string.Empty;
        }

        public string ChangePasswordWithOTPConfirm(CustomerChangePasswordWithOTPConfirm model)
        {
            var validOtp = _oTPRepository.Get(x =>
                x.Deleted == false &&
                x.Code == model.OTP &&
                x.ExpiredAtUTC > DateTime.UtcNow &&
                x.PhoneNo == model.PhoneNumber
            );

            if (validOtp == null)
            {
                return ERROR_INVALID_OTP;
            }

            //Find existed customer -> update this customer
            var existedCustomer = _customerRepository.Get(x =>
                x.Deleted == false &&
                x.PhoneNumber == model.PhoneNumber
            );

            if (existedCustomer == null)
            {
                return ERROR_NOT_FOUND_CUSTOMER;
            }

            //Generate new password hash
            byte[] salt = new byte[128 / 8];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(salt);
            }
            existedCustomer.PasswordHash = HashPassword(model.Password, salt);
            existedCustomer.SaltPasswordHash = Convert.ToBase64String(salt);
            _customerRepository.Update(existedCustomer);
            _unitOfWork.CommitChanges();

            return string.Empty;
        }

        public string UpdateCustomerPofile(CustomerRowViewModel model)
        {
            var existedCustomer = _customerRepository.Get(x => x.Username.Equals(model.Username, StringComparison.OrdinalIgnoreCase));
            if (existedCustomer == null)
            {
                return "Not found customer";
            }

            if (model.FullName != null && !model.FullName.Equals(""))
            {
                existedCustomer.FullName = model.FullName;
            }
            if (model.Email != null && !model.Email.Equals(""))
            {
                existedCustomer.Email = model.Email;
            }
            if (model.Address != null && !model.Address.Equals(""))
            {
                existedCustomer.Address = model.Address;
            }
            existedCustomer.UpdatedAtUTC = DateTime.UtcNow;
            existedCustomer.IsActive = true;
            _customerRepository.Update(existedCustomer);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
        }

        public CustomerRowViewModel FindCustomerByUsername(string usename)
        {
            var customer = _customerRepository.Get(x => x.Username.Equals(usename, StringComparison.Ordinal));
            var customerRowViewModel = _mapper.Map<Core.Models.Customer, CustomerRowViewModel>(customer);
            return customerRowViewModel;
        }

        public string ChangePasswordWithNoOTPConfirm(CustomerChangePasswordViewModel model)
        {
            var existedCustomer = _customerRepository.Get(x =>
               x.Username.Equals(model.Username) &&
               x.PasswordHash.Equals(HashPassword(model.PasswordHash, Convert.FromBase64String(x.SaltPasswordHash))));

            if (existedCustomer == null)
            {
                return ERROR_INVALID_PASSWORD;
            }

            //Generate new password hash
            byte[] salt = new byte[128 / 8];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(salt);
            }
            existedCustomer.PasswordHash = HashPassword(model.NewPassword, salt);
            existedCustomer.SaltPasswordHash = Convert.ToBase64String(salt);
            _customerRepository.Update(existedCustomer);
            _unitOfWork.CommitChanges();

            return string.Empty;
        }

        public string AddAccountStripeToReceiveMoney(string usename, string accountId)
        {
            var existedCustomer = _customerRepository.Get(x => x.Username == usename);
            if (existedCustomer == null)
            {
                return ERROR_NOT_FOUND_CUSTOMER;
            }

            try
            {

                var data = new
                {
                    client_secret = SETTING.Value.SecretStripe,
                    code = accountId,
                    grant_type = "authorization_code"
                };
                var dataJson = Newtonsoft.Json.JsonConvert.SerializeObject(data);

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + SETTING.Value.SecretStripe);

                    var response = client.PostAsync(
                        API_URL,
                        new StringContent(dataJson, Encoding.UTF8, "application/json")
                    ).Result;
                    //read content
                    JObject dataRes = (JObject)JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().GetAwaiter().GetResult());

                    string res = dataRes["stripe_user_id"].Value<string>();

                    accountId = res;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }


            existedCustomer.StripeConnectAccountId = accountId;
            _customerRepository.Update(existedCustomer);
            _unitOfWork.CommitChanges();

            return "";

        }

        public bool CheckIsExistedConnectBankAccount(string username)
        {
            var existedCustomer = _customerRepository.Get(x => x.Username == username);

            if (existedCustomer.StripeConnectAccountId == null)
            {
                return true;
            }

            return false;
        }

        public string ViewAccountConnect(string username)
        {
            var existedCustomer = _customerRepository.Get(x => x.Username == username);
            if (existedCustomer == null)
            {
                return ERROR_NOT_FOUND_CUSTOMER;
            }
            string linkResponse = null;
            try
            {
                StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

                var service = new LoginLinkService();
                var link = service.Create(existedCustomer.StripeConnectAccountId);
                linkResponse = link.Url;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return linkResponse;
        }

        public CustomerRowViewModel GetCustomerDetail(string username)
        {
            var customer = _customerRepository.Get(c => c.Username == username);
            var customerRowViewModel = _mapper.Map<Core.Models.Customer, CustomerRowViewModel>(customer);
            return customerRowViewModel;
        }

        public List<TransactionDataTable> GetTransactions(string username, int page, int pageSize)
        {
            var transactionAllRecord =
                (from PM in _paymentRepository.GetAllQueryable()
                 join CDC in _creditCardRepository.GetAllQueryable() on PM.CreditCartId equals CDC.Id
                 join Cus in _customerRepository.GetAllQueryable() on CDC.CustomerId equals Cus.Id
                 where Cus.Username == username
                 select new TransactionDataTable()
                 {
                     Amount = PM.Amount,
                     Description = PM.Description,
                     CreatedAtUTC = PM.CreatedAtUTC,
                     Type = "Payment"
                 }
                ).Union(
                    from RP in _refundRepository.GetAllQueryable()
                    join PM in _paymentRepository.GetAllQueryable() on RP.PaymentId equals PM.Id
                    join CDC in _creditCardRepository.GetAllQueryable() on PM.CreditCartId equals CDC.Id
                    join Cus in _customerRepository.GetAllQueryable() on CDC.CustomerId equals Cus.Id
                    where Cus.Username == username
                    select new TransactionDataTable()
                    {
                        Amount = RP.Amount,
                        Description = RP.Description,
                        CreatedAtUTC = RP.CreatedAtUTC,
                        Type = "Refund"
                    }
                    )
                .Union(
                    from PO in _payoutRepository.GetAllQueryable()
                    //join PM in _paymentRepository.GetAllQueryable() on PO.PaymentId equals PM.Id
                    //join CDC in _creditCardRepository.GetAllQueryable() on PM.CreditCartId equals CDC.Id
                    //join Cus in _customerRepository.GetAllQueryable() on CDC.CustomerId equals Cus.Id
                    where PO.Ticket.Seller.Username == username
                    select new TransactionDataTable()
                    {
                        Amount = PO.Amount,
                        Description = PO.Description,
                        CreatedAtUTC = PO.CreatedAtUTC,
                        Type = "Payout"
                    }
                    ).OrderByDescending(x => x.CreatedAtUTC).Skip((page - 1) * pageSize).Take(pageSize).ToList();


            ////var listRefund =
            ////    (from RP in _refundRepository.GetAllQueryable()
            ////     join PM in _paymentRepository.GetAllQueryable() on RP.PaymentId equals PM.Id
            ////     join CDC in _creditCardRepository.GetAllQueryable() on PM.CreditCartId equals CDC.Id
            ////     join Cus in _customerRepository.GetAllQueryable() on CDC.CustomerId equals Cus.Id
            ////     where Cus.Username == username
            ////     select new TransactionDataTable()
            ////     {
            ////         Amount = RP.Amount,
            ////         Description = RP.Description,
            ////         CreatedAtUTC = RP.CreatedAtUTC
            ////     }
            ////    );
            ////var listPayout =
            ////    (from PO in _payoutRepository.GetAllQueryable()
            ////     join PM in _paymentRepository.GetAllQueryable() on PO.PaymentId equals PM.Id
            ////     join CDC in _creditCardRepository.GetAllQueryable() on PM.CreditCartId equals CDC.Id
            ////     join Cus in _customerRepository.GetAllQueryable() on CDC.CustomerId equals Cus.Id
            ////     where Cus.Username == username
            ////     select new TransactionDataTable()
            ////     {
            ////         Amount = PO.Amount,
            ////         Description = PO.Description,
            ////         CreatedAtUTC = PO.CreatedAtUTC
            ////     }
            ////    );

            //////add 3 list thành 1 list
            ////List<TransactionDataTable> transactionAllRecord = null;
            ////foreach(var item in listPayment)
            ////{
            ////    var paymentItem = _mapper.Map<PaymentTransactionViewModel, TransactionDataTable>(item);
            ////    transactionAllRecord.Add(paymentItem);
            ////}
            ////foreach (var item in listPayout)
            ////{
            ////    var payoutItem = _mapper.Map<PayoutTransactionViewModel, TransactionDataTable>(item);
            ////    transactionAllRecord.Add(payoutItem);
            ////}
            ////foreach (var item in listRefund)
            ////{
            ////    var refundItem = _mapper.Map<RefundTransactionViewModel, TransactionDataTable>(item);
            ////    transactionAllRecord.Add(refundItem);
            ////}

            return transactionAllRecord;
        }

        public void Logout(string username, string deviceId)
        {
            var existedCustomer = _customerRepository.Get(x => x.Username == username);
            var customerDevice = _customerDeviceRepository.Get(x => x.DeviceId == deviceId && x.CustomerId == existedCustomer.Id);
            if (customerDevice != null)
            {
                customerDevice.IsLogout = true;
                _customerDeviceRepository.Update(customerDevice);
                _unitOfWork.CommitChanges();
            }
        }
    }
}
