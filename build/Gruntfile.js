module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // Task configuration
        clean: {
            // clean all compilation directories prior to a build
            test: ['test','release'],
            // clean all tests and extraneous debug files from a release candidate
            release: ['release/lib','release/src','release/runner.html','release/<%= pkg.name %>.js'],
            sourceMapClean: ['<%= pkg.name %>.min.map','<%= pkg.name %>.min.js','<%= pkg.name %>.js']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            test: {
                src: ['../client/lib/*.js'
                    ,'../client/src/namespaces.js'
                    ,'../client/src/utils.js'
                    ,'../client/src/exceptions.js'
                    ,'../client/src/httpResponse.js'
                    ,'../client/src/client.js'],
                dest: '<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            test: {
                // uglify has very poor support for source map generation outside of the output directory,
                // so we will compile and generate source maps in the root and then move the files to their
                // proper location
                // issue specified here: https://github.com/mishoo/UglifyJS2/issues/101
                options: {
                    sourceMap: '<%= pkg.name %>.min.map'
                },
                src: '<%= concat.test.dest %>',
                dest: '<%= pkg.name %>.min.js'
            }
        },
        copy: {
            test: {
                files: [
                    {
                        expand: true,
                        cwd: '../client/test/',
                        src: ['**'],
                        dest: 'test/'
                    }
                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/',
                        src: ['**'],
                        dest: 'release/',
                        rename: function(dest, src) {
                            // add version number to release candidate
                            var pkg = grunt.file.readJSON('package.json');
                            var minifiedFileName = pkg.name + '.min.js';

                            if (src == minifiedFileName)
                                return dest + pkg.name + '-' + pkg.version + '.min.js'

                            return dest + src;
                        }
                    }
                ]
            },
            sourceMapMove: {
                files: [
                    {
                        src: ['<%= pkg.name %>.min.map','<%= pkg.name %>.min.js','<%= pkg.name %>.js'],
                        dest: 'test/'
                    }
                ]
            }
        },
        usemin: {
            html: ['test/runner.html'],
            //css: ['dist/**/*.css'],
            options: {
                dirs: ['test']
            }
        },
        mocha: {
            all: ['test/runner.html']
        },
        jshint: {
            beforeconcat: ['../client/src/**/*']
            //,afterconcat: ['build/<%= pkg.name %>.js']
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['../client/src/**/*','../client/test/**/*'],
            tasks: ['test']
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'test',
                    keepalive: true
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');


    // Build tasks
    grunt.registerTask('build', ['clean:test','concat','uglify','copy:test','usemin','copy:sourceMapMove','clean:sourceMapClean']);
    grunt.registerTask('test', ['build','mocha','jshint']);
    grunt.registerTask('release', ['build','test','copy:release','clean:release']);
    grunt.registerTask('default', ['release']);
    grunt.registerTask('run', ['connect']);
};
