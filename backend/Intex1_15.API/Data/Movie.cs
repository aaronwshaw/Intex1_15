using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;

namespace Intex1_15.API.Data
{
    [Table("movies_titles")]
    public class Movie
    {
                [Key]
        public string show_id { get; set; } // Non-nullable primary key

        // Nullable string properties
        public string? type { get; set; }
        public string? title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        public int? release_year { get; set; }
        public string? rating { get; set; }
        public string? duration { get; set; }
        public string? description { get; set; }

        // Nullable integer genre properties
        [Column("Action")]
        public int? action { get; set; }

        [Column("Adventure")]
        public int? adventure { get; set; }

        [Column("Anime Series International TV Shows")]
        public int? anime { get; set; }

        [Column("British TV Shows Docuseries International TV Shows")]
        public int? british { get; set; }

        [Column("Children")]
        public int? children { get; set; }

        [Column("Comedies")]
        public int? comedies { get; set; }

        [Column("Comedies Dramas International Movies")]
        public int? comedies_dramas_int { get; set; }

        [Column("Comedies International Movies")]
        public int? comedies_int { get; set; }

        [Column("Comedies Romantic Movies")]
        public int? comedies_rom { get; set; }

        [Column("Crime TV Shows Docuseries")]
        public int? crime_docu { get; set; }

        [Column("Documentaries")]
        public int? documentaries { get; set; }

        [Column("Documentaries International Movies")]
        public int? documentaries_int { get; set; }

        [Column("Docuseries")]
        public int? docuseries { get; set; }

        [Column("Dramas")]
        public int? dramas { get; set; }

        [Column("Dramas International Movies")]
        public int? dramas_int { get; set; }

        [Column("Dramas Romantic Movies")]
        public int? dramas_rom { get; set; }

        [Column("Family Movies")]
        public int? family { get; set; }

        [Column("Fantasy")]
        public int? fantasy { get; set; }

        [Column("Horror Movies")]
        public int? horror { get; set; }

        [Column("International Movies Thrillers")]
        public int? thrillers_int { get; set; }

        [Column("International TV Shows Romantic TV Shows TV Dramas")]
        public int? romantic_tv_shows_int { get; set; }

        [Column("Kids' TV")]
        public int? kids { get; set; }

        [Column("Language TV Shows")]
        public int? language_tv { get; set; }

        [Column("Musicals")]
        public int? musicals { get; set; }

        [Column("Nature TV")]
        public int? nature { get; set; }

        [Column("Reality TV")]
        public int? reality { get; set; }

        [Column("Spirituality")]
        public int? spirituality { get; set; }

        [Column("TV Action")]
        public int? action_tv { get; set; }

        [Column("TV Comedies")]
        public int? tv_comedies { get; set; }

        [Column("TV Dramas")]
        public int? tv_dramas { get; set; }

        [Column("Talk Shows TV Comedies")]
        public int? talk_shows { get; set; }

        [Column("Thrillers")]
        public int? thrillers { get; set; }

        [NotMapped]
        public string? PrimaryGenre => GetPrimaryGenre();

        private string GetPrimaryGenre()
        {
            var genreProperties = this.GetType().GetProperties()
                .Where(p => p.PropertyType == typeof(int?) && p.Name != nameof(show_id));

            foreach (var prop in genreProperties)
            {
                // Get the value as a nullable integer
                int? value = (int?)prop.GetValue(this);
                if (value.HasValue && value == 1)
                {
                    var columnAttribute = prop.GetCustomAttribute<ColumnAttribute>();
                    return columnAttribute != null ? columnAttribute.Name : prop.Name;
                }
            }

            return "Unknown";
        }

    }
}
