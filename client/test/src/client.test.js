describe("moya.client", function() {
    var server;
    var ROOT_RESPONSE = '{"version": "0.0.0","_links": {"self": {"href": "http://my-api-entrypoint.com/"},"patients": {"href": "http://my-api-entrypoint.com/patients"}}}';
    var PATIENTS_RESPONSE = '{"version":"0.0.0","_links":{"self":{"href":"http://my-api-entrypoint.com/patients"},"template":{"href":"http://my-api-entrypoint.com/patients;template"},"profile":{"href":"http://atlas.smartpathlabs.com/profiles/patients/"},"queries":[{"find":{"href":"http://my-api-entrypoint.com/patients{?firstname,lastname,ssn}"}}]}}';

    before(function(){
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    after(function() {
        server.restore();
    });

    it("throws Illegal Argument Exception when no options are supplied to constructor", function() {
        expect(moya.client).to.throw(IllegalArgumentException);
    });
    it("throws Illegal Argument Exception when no root url is supplied to constructor", function() {
        expect(function() { moya.client({}) }).to.throw(IllegalArgumentException);
    });

    it("returns valid response when supplied with valid constructor args", function(done) {

        server.respondWith("GET", "http://my-api-entrypoint.com/", [200, { "Content-Type": "application/json" },ROOT_RESPONSE]);
        server.respondWith("GET", "http://my-api-entrypoint.com/patients", [200, { "Content-Type": "application/json" },PATIENTS_RESPONSE]);

        var api = new moya.client({ root: "http://my-api-entrypoint.com/" });
        var patients = api.root().then(function(response) {
            return response.patients();
        });

        patients.then(function(response) {
            console.log(response);
            done();
        });

        server.respond();
    });

    /*describe("moya.client.rootUrl", function(done) {
        it("is populated with root url supplied in constructor args", function() {
            var entrypointUrlUnderTest = "http://my-api-entrypoint.com/";
            var api = new moya.client({ root: entrypointUrlUnderTest });
            expect(api.rootUrl).to.equal(entrypointUrlUnderTest);
        });
    });*/
});