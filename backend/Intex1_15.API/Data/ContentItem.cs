using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Intex1_15.API.Data
{
    [Table("ContentItems")]
    public class ContentItem
    {
        [Key]
        [Column("show_id", Order = 0)]
        public string ShowId { get; set; }

        [Key]
        [Column("recommended_show_id", Order = 1)]
        public string RecommendedShow { get; set; }

        [Required]
        [Column("similarity_score")]
        public int Rank { get; set; }
    }
}
