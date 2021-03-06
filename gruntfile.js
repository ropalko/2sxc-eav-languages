/// <binding />
module.exports = function (grunt) {
    "use strict";
    var srcRoot = "src/i18n/",
        srcRootEn = "src/en-master/",
        distRoot = "dist/",
        tmpRoot = "tmp/",
        tmpAnalytics = "tmp/analyt/",
        analysisRoot = "analysis/",
        typePath = "content-types/",
        packs = [
            "admin",    // for the EAV admin UI
            "edit",     // for the EAV edit UI
            "inpage",   // for the 2sxc in-page button / dialogs
            "sxc-admin",// for the 2sxc admin UIs like App, Manage Apps, etc.
            "source-editor-snippets",
        ],
        languages = [
            "en",   // English, core distribution, responsible: 2sic
            "de",   // German - responsible 2sic
            "es",   // Spanish - responsible ...
            "fr",   // French - responsible BSI
            "it",   // Italian - responsible Opsi
            "uk",   // Ukranian - responsible ForDnn
            "nl",   // Nederlands / Dutch - responsible Tycho de Waard - only partially translated
        ],
        //typeLanguages = [
        //    "en",
        //    "de"
        //],
        basicPacks = [
            "edit",     // for the EAV edit UI
            "inpage",   // for the 2sxc in-page button / dialogs
        ],
        basicLanguages = [
            "nl",   // Nederlands / Dutch - responsible Tycho de Waard - only partially translated
        ];

    var mergeFiles = {};

    // prepare all full packs
    packs.forEach(function(pack) {
        languages.forEach(function (lang) {
            var key = distRoot + "i18n/" + pack + "-" + lang + ".js",
                val = [((lang === "en") ? srcRootEn : srcRoot) + "**/" + pack + "-" + lang + ".json"];
            mergeFiles[key] = val;
            grunt.verbose.writeln("pack [" + key + "]=" + val);
        });
    });
	
    // prepare all minimal packs
    basicPacks.forEach(function (pack) {
        basicLanguages.forEach(function (lang) {
            mergeFiles[distRoot + "i18n/" + pack + "-" + lang + ".js"]
                = [((lang === "en") ? srcRootEn : srcRoot) + "**/" + pack + "-" + lang + ".json"];
        });
    });
	
	// add angular-i18n files
	var angulari18nFiles = [];
	languages.forEach(lang => {
		angulari18nFiles.push("angular-locale_" + lang + ".js");
	});

    // try to build list of content-type files
    //var ctFiles = grunt.file.expand(srcRootEn + typePath + "*.json");
    //ctFiles.forEach(function (typeFile) {
    //    var file = typeFile.substring(typeFile.lastIndexOf("/") + 1).replace("-en.json", "").toLowerCase();
    //    typeLanguages.forEach(function (lang) {
    //        var key = distRoot + "i18n/" + typePath + file + "-" + lang + ".js",
    //            val = [((lang === "en") ? srcRootEn : srcRoot) + typePath + "**/" + file + "-" + lang + ".json"];
    //        mergeFiles[key] = val;
    //        grunt.verbose.writeln("type [" + key + "]:" + val);
    //    });
    //});

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            dist: distRoot + "**/*", // only do this when you will re-copy the eav stuff into here
            tmp: tmpRoot + "**/*"
        },

        /* This is an experimental block - will merge the few changes in -en-uk with the master -en */
        /* 2015-11-29 dm - seems to work, but not very generic yet. Will persue more when I have a real use case */
        //"merge-json": {
        //    "en-uk": {
        //        src: [ srcRoot + "admin-en.json", srcRoot + "admin-en-uk.json" ],
        //        dest: tmpRoot + "admin-en-uk.js"
        //    }
        //},
        
        copy: {
            enUk: {
                files: [

                ]
            },
            //i18n: {
            //    files: [
            //        {
            //            expand: true,
            //            cwd: "src/i18n/", 
            //            src: ["**/*.json"],
            //            dest: "dist/i18n/", 
            //            rename: function (dest, src) {
            //                return dest + src.replace(".json", ".js");
            //            }
            //        }
            //    ]
            //},
            "import-tinymce-libs": {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        cwd: "src/i18n-lib/", 
                        src: ["**/*.js"],
                        dest: "dist/i18n/lib/"
                    }
                ]
            },
			"import-angulari18n-libs": {
				files: [
					{
						expand: true,
						flatten: false,
						cwd: "bower_components/angular-i18n/",
						src: angulari18nFiles,
						dest: distRoot + "i18n/lib/angular-i18n/"
					}
				]
			}
        },
        "merge-json": {
            "all": {
                files: mergeFiles
                //    {
                //    "tmp/i18n/edit-de.js": [srcRoot + "**/edit-de.json"],
                //    //"www/de.json": [ "src/**/*-de.json" ]
                //}
            }
        },
        /* Experiment to flatten the JSON for reviewing translation completeness */
        //flatten_json: {
        //    main: {
        //        files: [
        //            {
        //                expand: true,
        //                src: [srcRoot + "*-en.json"],
        //                dest: analysisRoot
        //            }
        //        ]
        //    }
        //},

        /* Experimeting with wrapping the flattened jsons with [ and ] */
        /* note: doesn't work ATM*/
        //concat: {
        //    options: {
        //        banner: "[",
        //        footer: "]"
        //    },
        //    default: {
        //        src: [analysisRoot + "**/*.json"],
        //        dest: tmpAnalytics
        //        //,
        //        //dest: 
        //    }
        //    //default_options: {
        //    //    files: [
        //    //      {
        //    //          prepend: "[",
        //    //          append: "]",
        //    //          input: analysisRoot + "**/*.json" //,
        //    //          //output: 'path/to/output/file'
        //    //        }
        //    //     ]
        //    //}
        //},

        /* Watchers to auto-compile while working on it */
        watch: {
            options: {
                atBegin: true
            },
            i18n: {
                files: ["gruntfile.js", "src/**"],
                tasks: ["build"]
            }
        }


    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-merge-json");
    // grunt.loadNpmTasks("grunt-flatten-json");
    // grunt.loadNpmTasks("grunt-contrib-concat");

    // Default task(s).
    grunt.registerTask("build-auto", ["watch:i18n"]);
    grunt.registerTask("build", [
        //"clean:tmp",
        "merge-json"
    ]);
	grunt.registerTask("import-angulari18n-libs", ["copy:import-angulari18n-libs"]);
};