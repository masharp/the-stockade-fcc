const Request = require("request");
const BASE_URL = "http://localhost:3000/";

/*TEST HTTP ROUTING */
describe("HTTP Route GET Testing", function() {
  //Home view
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      Request.get(BASE_URL, function(error, response, body) {
        if(error) console.error(error);
        expect(response.statusCode).toBe(200);
        console.log("[ROUTE STATUS] PASS");
        done();
      });
    });

    it("returns proper view", function(done) {
      Request.get(BASE_URL, function(error, response, body) {
        if(error) console.error(error);
        expect(body).toContain("<title>The Stockade | Stock Market Watching</title>");
        console.log("[ROUTE VIEW] PASS");
        done();
      });
    });
  });

  describe("GET /API", function() {
    it("returns status code 200", function(done) {
      Request.get(BASE_URL + "api", function(error, response, body) {
        if(error) console.error(error);
        expect(response.statusCode).toBe(200);
        console.log("[ROUTE API] PASS");
        done();
      });
    });
  });
});
