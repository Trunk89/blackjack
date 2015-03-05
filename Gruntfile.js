module.exports = function(grunt) {

    // Auto-load grunt plugin tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            js: {
                // the files to concatenate
                src: [
                    'dev/js/<%= pkg.name %>.js',
                    'dev/js/utils/*.js',
                    'dev/js/models/*.js',
                    'dev/js/extends/*.js',
                    'dev/js/controllers/*.js',
                    'dev/js/libs/*.js'
                ],
                // the location of the resulting JS file
                dest: 'build/js/<%= pkg.name %>.js'
            },
            css: {
                src: ['dev/css/*.css'],
                dest: 'build/css/<%= pkg.name %>.css'
            },
            libs: {
                //src: ['dev/js/libs/*.js'],
                //dest: 'build/js/libs.js'
            }

        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'release/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                    //'release/js/libs.min.js': ['<%= concat.libs.dest %>']
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    'release/css/<%= pkg.name %>.min.css': ['<%= concat.css.dest %>']
                }]
            }
        },
        jasmine: {
            min: {
                src: 'release/js/*.min.js',
                options: {
                    specs: 'test/spec/*Spec.js',
                    helpers: 'test/spec/*Helper.js'
                }
            },
            dev: {
                src: ['dev/js/Blackjack.js', 'dev/js/utils/*.js', 'dev/js/models/*.js', 'dev/js/**/*.js'],
                options: {
                    specs: 'test/spec/*Spec.js',
                    helpers: 'test/spec/*Helper.js'
                }
            }

        },
        jshint: {
            // define the files to lint
            files: ['Gruntfile.js', 'dev/js/controllers/*.js', 'dev/js/extends/*.js', 'dev/js/models/*.js', 'dev/js/utils/*.js', 'dev/js/*.js', 'test/spec/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: false,
                    console: true,
                    module: true,
                    quotmark: "single"
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'jasmine']
        },
        env :{
            options : {
                /* Shared Options Hash */
                //globalOption : 'foo'
            },
            dev: {
                NODE_ENV : 'DEVELOPMENT'
            },
            prod : {
                NODE_ENV : 'PRODUCTION'
            }

        },
        preprocess : {
            dev : {
                src : 'dev/index.html',
                dest : 'index.html'
            },
            prod : {
                src : 'dev/index.html',
                dest : 'release/index.html',
                options : {
                    context : {
                        name : '<%= pkg.name %>',
                        version : '<%= pkg.version %>',
                        now : '<%= now %>',
                        ver : '<%= ver %>'
                    }
                }
            }

        }
    });

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'jasmine']);

// the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('build', ['jshint', 'env:dev', 'preprocess:dev', 'env:prod', 'preprocess:prod', 'concat', 'uglify', 'cssmin', 'jasmine:min']);
    grunt.registerTask('buildmin', ['jshint', 'env:prod', 'preprocess:prod', 'concat', 'uglify', 'cssmin', 'jasmine:min']);
    grunt.registerTask('builddev', ['jshint', 'env:dev', 'preprocess:dev', 'jasmine:dev']);

};