using System.ComponentModel.DataAnnotations.Schema;

[Table("movies_ratings")] // <- ✅ Explicit table mapping
public class MovieRating
{
    public int user_id { get; set; }
    public string show_id { get; set; }
    public int rating { get; set; }
}
