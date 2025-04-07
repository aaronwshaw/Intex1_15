using Intex1_15.API.Data;
using Intex1_15.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Intex1_15.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //Makes it so not just everyone can look at this api, only those that are authorized
    [Authorize]
    public class IntexController : ControllerBase
    {
        private IntexDbContext _Intexcontext;
        public IntexController(IntexDbContext temp)
        {
            _Intexcontext = temp;
        }

        [HttpGet("GetAllExamples")]
        public IActionResult GetAllExamples()
        {
            var examples = _Intexcontext.Examples.ToList();

            return Ok(examples);
        }

    }
}
