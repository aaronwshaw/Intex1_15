using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Intex1_15.API.Data
{

[Table("CollabUsers")]
    public class CollabUser
    {
        [Key]
        [Column("user_id", Order = 0)]
        public string UserId { get; set; }

        [Key]
        [Column("recommended_show_id", Order = 1)]
        public string RecommendedShow { get; set; }

        [Required]
        [Column("rank")]
        public int Rank { get; set; }
    }

}
