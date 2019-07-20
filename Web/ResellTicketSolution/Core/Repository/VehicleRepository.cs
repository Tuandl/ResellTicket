using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IVehicleRepository : IRepository<Vehicle>
    {

    }

    public class VehicleRepository : RepositoryBase<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
