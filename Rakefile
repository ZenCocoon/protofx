require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

desc "Generates documentation"
task :doc do
  pdoc = 'lib/pdoc/lib/pdoc'
  unless File.exists?(pdoc)
    puts "\nYou'll need PDoc to generate the documentation. Just run:\n\n"
    puts " $ git submodule init lib/pdoc"
    puts " $ git submodule update lib/pdoc"
    puts "\nand you should be all set.\n\n"
  end
  
  require pdoc
  require 'fileutils'
  require 'tempfile'
  
  output_directory    = 'doc'
  templates_directory = File.join('lib', 'pdoc_templates', 'html')
  javascript_files    = File.join('src', '**', '*.js')
  
  FileUtils.rm_rf(output_directory)
  FileUtils.mkdir_p(output_directory)
  
  temp = Tempfile.new('fx_doc')
  Dir.glob(javascript_files).each do |f|
    temp << "\n" << File.read(f)
  end
  temp.rewind
  
  PDoc::Runner.new(temp.path, :output => output_directory, :templates => templates_directory).run
  temp.close
end


desc "Build all dist files"
task :build => ['build:packed_base', 'build:packed_full'] do
end
desc "Alias for build"
task :dist => :build

PROTOFX_ROOT             = File.expand_path(File.dirname(__FILE__))
PROTOFX_DIST_DIR         = File.join(PROTOFX_ROOT, 'dist')
PROTOFX_SRC_DIR          = File.join(PROTOFX_ROOT, 'src')
PROTOFX_TEST_DIR         = File.join(PROTOFX_ROOT, 'test')
PROTOFX_TEST_UNIT_DIR    = File.join(PROTOFX_TEST_DIR, 'unit')
PROTOFX_TMP_DIR          = File.join(PROTOFX_TEST_UNIT_DIR, 'tmp')

BASE_DIST_FILES          = %w(base/base.js base/attribute.js base/metronome.js util/string.js fx/element.js prototype_ext/element.js)
BASE_DIST_OUTPUT         = File.join(PROTOFX_DIST_DIR , 'protofx_base.js')
PACKED_BASE_DIST_OUTPUT  = File.join(PROTOFX_DIST_DIR , 'protofx_base_packed.js')

FULL_DIST_FILES          = BASE_DIST_FILES + %w(base/transition.js base/score.js)
FULL_DIST_OUTPUT         = File.join(PROTOFX_DIST_DIR, 'protofx.js')
PACKED_FULL_DIST_OUTPUT  = File.join(PROTOFX_DIST_DIR, 'protofx_packed.js')

YUI_COMPRESSOR           = 'java -jar lib/yuicompressor/yuicompressor-2.3.5.jar'

namespace :build do
  def concat_files(files, output)
    FileUtils.mkdir_p(File.dirname(output))
    
    file = File.new(output, 'w')
    files.each do |f|
      file << "\n" << File.read(File.join(PROTOFX_SRC_DIR, f))
    end
    file.close
  end
  
  desc "Builds base dist fill (not compressed)"
  task :base do
    concat_files(BASE_DIST_FILES, BASE_DIST_OUTPUT)
  end
  
  desc "Builds base dist fill (compressed by yui compressor)"
  task :packed_base => :base do
    system "#{YUI_COMPRESSOR} #{BASE_DIST_OUTPUT} > #{PACKED_BASE_DIST_OUTPUT}"
  end
  
  desc "Builds full dist fill (not compressed)"
  task :full do
    concat_files(FULL_DIST_FILES, FULL_DIST_OUTPUT)
  end
  
  desc "Builds full dist fill (compressed by yui compressor)"
  task :packed_full => :full do
    system "#{YUI_COMPRESSOR} #{FULL_DIST_OUTPUT} > #{PACKED_FULL_DIST_OUTPUT}"
  end
end

desc %[Builds the ProtoFX distribution, then builds and runs the ProtoFX test suite.
The following options are available:
- BROWSERS: Lets you choose which browsers to run the tests on.
  For example, to run the test suite on Internet Explorer and Chrome:
    $ rake test BROWSERS=chrome,ie
  Currently supported browsers are:
    Internet Explorer     ie
    Firefox               firefox
    Safari                safari
    Opera                 opera
    Konqueror             konqueror
    Chrome                chrome
- TESTS: Lets you specify which tests you want to build and run.
  For example, to run "base_test.js" and "score_test.js":
    $ rake test TESTS=base,score
- TESTCASES: Lets you specify which testcase to run.
  For example, to run test "testGetDuration" and "testMetronomeUpdate" of "base_test.js":
    $ rake test TESTS=base TESTCASES=testGetDuration,testMetronomeUpdate
]
task :test => ['test:build', 'test:run']
namespace :test do
  desc 'Runs the ProtoFX test suite. For available options, see "rake test".'
  task :run => [:require] do
    testcases = ENV['TESTCASES']
    browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
    tests_to_run = ENV['TESTS'] && ENV['TESTS'].split(',')
    runner = UnittestJS::WEBrickRunner::Runner.new(:test_dir => PROTOFX_TMP_DIR)
 
    Dir[File.join(PROTOFX_TMP_DIR, '*_test.html')].each do |file|
      file = File.basename(file)
      test = file.sub('_test.html', '')
      unless tests_to_run && !tests_to_run.include?(test)
        runner.add_test(file, testcases)
      end
    end
    
    UnittestJS::Browser::SUPPORTED.each do |browser|
      unless browsers_to_test && !browsers_to_test.include?(browser)
        runner.add_browser(browser.to_sym)
      end
    end
    
    trap('INT') { runner.teardown; exit }
    runner.run
  end
  
  desc 'Builds the ProtoFX distribution and test suite. For available options, see "rake test".'
  task :build => [:clean, :dist] do
    builder = UnittestJS::Builder::SuiteBuilder.new({
      :input_dir => PROTOFX_TEST_UNIT_DIR,
      :assets_dir => PROTOFX_DIST_DIR
    })
    selected_tests = (ENV['TESTS'] || '').split(',')
    builder.collect(*selected_tests)
    builder.render
  end
  
  desc 'Empties the ProtoFX test suite directory.'
  task :clean => [:require] do
    UnittestJS::Builder.empty_dir!(PROTOFX_TMP_DIR)
  end
  
  task :require do
    lib = 'vendor/unittest_js/lib/unittest_js'
    unless File.exists?(lib)
      puts "\nYou'll need UnittestJS to run the tests. Just run:\n\n"
      puts " $ git submodule init vendor/unittest_js"
      puts " $ git submodule update vendor/unittest_js"
      puts "\nand you should be all set.\n\n"
    end
    require lib
    
    # UnittestJS currently relies on Prototype. We need to include a current
    # version of Prototype, not the one built-in to the library. Hence the
    # monkey-pacthing below.
    class UnittestJS::Builder::TestBuilder
      def lib_files
        lib_assets = @options.output_unittest_assets_dir.name
        [
          to_script_tag("#{@options.output_assets_dir.name}/prototype.js"),
          to_script_tag("#{lib_assets}/unittest.js"),
          to_link_tag("#{lib_assets}/unittest.css")
        ].join("\n")
      end
    end
  end
end