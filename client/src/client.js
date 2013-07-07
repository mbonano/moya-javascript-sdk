moya.client = function(opt) {
    opt = opt || {};
    if (!opt.root || opt.root === null) {
        // throw required argument exception
        throw new IllegalArgumentException("A root url is required");
    }

    // merge supplied options into client
    merge(this, opt);

    var self = this;
    return {
        rootUrl: self.root,
        root: function() { return new moya.RESTResponse({ url: this.rootUrl }); }
        /*root: function() {
            var self = this;
            var deferred = Q.defer();
            HTTPRequest.get(this.rootUrl, function(status, headers, content)
                {
                    console.log(status, headers, content);
                    //console.log(content);

                    var response = JSON.parse(content);
                    var result = {
                        raw: response,
                        patients: function() { return this.getResponse('sdfg'); },
                        getResponse: function(resourceUrl) {
                            return [];
                        }
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

                    function processLinks(links, target) {
                        var callLink = function() { console.log(' just fired'); };
                        for (var link in links) {
                            if (links.hasOwnProperty(link)) {
                                target[link] = callLink;
                            }
                        }
                    }

                    deferred.resolve(result);
                },
                {
                    *//*beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + HTTPRequest.base64encode(self.key));
                    }*//*
                }
            );
            return deferred.promise;
        }*/
    };
};