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
        public DbSet<CollabItem> CollabItems { get; set; }
        public DbSet<ContentItem> ContentItems { get; set; }
        public DbSet<CollabUser> CollabUsers { get; set; }
        public DbSet<MovieRating> MovieRatings { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CollabUser>()
                .HasKey(c => new { c.UserId, c.RecommendedShow });

            modelBuilder.Entity<CollabItem>()
                .HasKey(c => new { c.WatchedShowId, c.RecommendedShowId });

            modelBuilder.Entity<ContentItem>()
                .HasKey(c => new { c.ShowId, c.RecommendedShow });

            modelBuilder.Entity<MovieRating>()
                .HasKey(r => new { r.user_id, r.show_id }); // ✅ composite key
        }
    }
}
