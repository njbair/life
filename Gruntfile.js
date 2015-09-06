module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        jshint: {
            all: ['js/**.js']
        },
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2
                },
                files: {
                    "css/style.css": "less/style.less",
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({ browsers: ['last 2 versions'] })
                ]
            },
            dist: { src: 'css/style.css' }
        },
        watch: {
            options: {
                livereload: true,
            },
            jshint: {
                files: [ 'js/**.js' ]
            },
            less: {
                files: [ '**/*.less' ], // which files to watch
                tasks: [ 'less', 'postcss' ],
            }
        }
    });
    
    grunt.registerTask('default', ['jshint', 'less', 'postcss', 'watch']);
    grunt.registerTask('build', ['jshint', 'less', 'postcss']);
};
