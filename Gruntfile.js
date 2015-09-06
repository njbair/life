module.exports = function(grunt) {
    var autoprefixer = require('autoprefixer-core');
    require('jit-grunt')(grunt);

    grunt.initConfig({
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
                    require('autoprefixer-core')({ browsers: ['last 2 versions'] })
                ]
            },
            dist: { src: 'css/style.css' }
        },
        watch: {
            options: {
                livereload: true,
            },
            less: {
                files: [ '**/*.less' ], // which files to watch
                tasks: [ 'less', 'postcss' ],
            }
        }
    });
    
    grunt.registerTask('default', ['less', 'postcss', 'watch']);
};
