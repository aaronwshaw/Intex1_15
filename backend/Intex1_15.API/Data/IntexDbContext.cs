using System;
using System.Collections.Generic;
using Intex1_15.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Intex1_15.API.Data
{

    public partial class IntexDbContext : DbContext
    {

        public IntexDbContext(DbContextOptions<IntexDbContext> options)
            : base(options)
        {
            
        }
        public DbSet<Movie> Movies { get; set; }
    }
}

