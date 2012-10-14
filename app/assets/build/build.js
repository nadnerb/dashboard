({
    baseUrl: '../javascripts',
    mainConfigFile: '../javascripts/main.js',
    name: '../javascripts/main',
    out: '../javascripts/concatenated-modules.js',
    preserveLicenseComments: false,
    paths: {
        requireLib: 'libs/require'
    },
    include: 'requireLib',
    uglify: {
        toplevel: true,
        ascii_only: true,
        max_line_length: 1000
    },
})