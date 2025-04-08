using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Intex1_15.API.Data
{
    [Table("CollabItems")]
    public class CollabItem
    {
        [Key]
        [Column("watched_show_id", Order = 0)]
        public string WatchedShowId { get; set; }

        [Key]
        [Column("recommended_show_id", Order = 1)]
        public string RecommendedShowId { get; set; }

        [Required]
        [Column("rank")]
        public int Rank { get; set; }
    }
}
