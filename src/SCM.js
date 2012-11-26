/* 
 * SCM.js: Library for visualizing Bitergia SCM data
 */

var SCM = {};

(function() {

SCM.displayBasic = displayBasic;
SCM.displayBasicHTML = displayBasicHTML;
SCM.displayData = displayData;
SCM.displayEvo = displayEvo;

var basic_metrics = {
	'commits': {
		'divid':"commits_scm", 
		'column':"commits",
		'name':"Commits",
		'desc':"Evolution of the number of commits (aggregating branches)"},
	'committers': {
		'divid':"committers_scm", 
		'column':"committers",
		'name':"Committers",
		'desc':"Unique committers making changes to the source code"},			
	'branches': {
		'divid':"branches_scm", 
		'column':"branches",
		'name':"Branches",
		'desc':"Evolution of the number of branches"},			
	'files': {
		'divid':"files_scm", 
		'column':"files",
		'name':"Files",
		'desc':"Evolution of the number of unique files handled by the community"},
	'repositories': {
		'divid':"repositories_scm", 
		'column':"repositories",
		'name':"Repositories",
		'desc':"Evolution of the number of repositories"}			
};

function displayData(filename) {
	$.getJSON(filename, function(data) {
		$("#scmFirst").text(data.first_date);
		$("#scmLast").text(data.last_date);
		$("#scmCommits").text(data.commits);
		$("#scmFiles").text(data.files);
		$("#scmAuthors").text(data.authors);
		$("#scmCommitters").text(data.committers);
	});
}

//Create HTML code to show the metrics
// TODO: Identical to ITS. Share!
function displayBasicHTML(its_file, div_target) {
	$.getJSON(its_file, function(history) {
		var new_div = '<div class="info-pill">';
		new_div += '<h1>Change sets (commits to source code)</h1></div>';
		$("#"+div_target).append(new_div);
		for (var id in basic_metrics) {
			var metric = basic_metrics[id];
			new_div = '<div id="flotr2_open" class="info-pill m0-box-div">';
			new_div += '<h1>'+metric.name+'</h1>';
			new_div += '<div class ="m0-box" id="'+metric.divid+'"></div>' ;
			new_div += '<p>'+metric.desc+'</p>';
			new_div += '</div>' ;
			$("#"+div_target).append(new_div);
			M0.displayBasicLines(metric.divid, history, 
					metric.column, true, metric.name);
		}
	});
}

function displayBasic(scm_file) {
	$.getJSON(scm_file, function(history) {
		basicEvo(history);
	});
}

function basicEvo (history) {
	for (var id in basic_metrics) {
		var metric = basic_metrics[id];
		if ($('#'+metric.divid).length)
			M0.displayBasicLines(metric.divid, history, 
					metric.column, true, metric.name);
	}
}
	
function displayEvo (id, scm_file, markers, config) {
	$.getJSON(scm_file, function(history) {
		envisionEvo(id, history, markers, config);
	});
}

function envisionEvo (id, history, markers, config) {
	var V = envision, firstMonth = history.id[0], 
	commits = [history.id, history.commits ], 
	committers = [history.id, history.committers ], 
	ratio = [history.id, history.ratio ], 
	files = [history.id, history.files ], 
	branches = [history.id, history.branches ], 
	repositories = [history.id, history.repositories ], 
	dates = history.date, 
	container = document.getElementById(id),
	options, vis;

	options = {
		container : container,
		data : {
			commits : commits,
			committers : committers,
			files : files,
			branches : branches,
			repositories : repositories,
			summary : commits,
			markers : markers,
			dates : dates,
			envision_scm_hide: config.scm_hide
		},
		trackFormatter : function(o) {
			var
			//   index = o.index,
			data = o.series.data, index = data[o.index][0]
					- firstMonth, value;

			value = dates[index] + ": ";
			value += commits[1][index] + " commits, ";
			value += committers[1][index] + " committers, <br/> ";
			value += files[1][index]+ " files, ";
			value += branches[1][index] + " branches, ";
			value += repositories[1][index] + " repos";
			return value;
		},
		xTickFormatter : function(index) {
			var label = dates[index - firstMonth];
			if (label === "0") label = "";
			return label;
		},
		yTickFormatter : function(n) {
			return n + '';
		},
		// Initial selection
		selection : {
			data : {
				x : {
					min : history.id[0],
					max : history.id[history.id.length - 1]
				}
			}
		}
	};
	// Create the TimeSeries
	vis = new envision.templates.SCM_Milestone0(options);
}
})();