namespace Service.SMSService
{
    public interface ISmsService
    {
        string SendSMS(string message, string phoneNumber);
    }
}
