moya.RESTResponse = function(opt) {
    var deferred = Q.defer();
    console.log('opt.url: ' + opt.url);
    HTTPRequest.get(opt.url, function(status, headers, content)
        {
            var response = JSON.parse(content);
            var result = {
                raw: response
            };

            var reservedProperties = _(['_links','_embedded']);
            for (var property in response) {
                if (response.hasOwnProperty(property)) {
                    console.log('property: ' + property);
                    if (reservedProperties.contains(property)) {
                        processReservedProperty(property, response[property], result);
                        console.log('process reserved property');
                    }
                    else {
                        result[property] = response[property];
                    }

                }
            }

            function processReservedProperty(property, value, target) {
                if (property === "_links") processLinks(value, target);
            }

            function createResourceRequestMethod(resourceUrl) {
                return function() { return new moya.RESTResponse({ url: resourceUrl }); };
            }

            function processLinks(links, target) {
                for (var link in links) {
                    if (links.hasOwnProperty(link)) {
                        //console.log('link.href: '+ links[link].href);
                        target[link] = createResourceRequestMethod(links[link].href);
                    }
                }
            }

            deferred.resolve(result);
        },
        {
            /*beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + HTTPRequest.base64encode(self.key));
             */
        }
    );
    return deferred.promise;
};