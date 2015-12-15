$(function() {

	ContactWizard.searchFilter();
	ContactWizard.getUrlParams();
	console.log(Generic.searchType);
	Generic.subSearchType = 'ContactWizard';
	Utilities.setUpActionMenu(Constants.ACTION_MENU[Generic.searchType]);
	ContactWizard.pageSetUp();
	Comman.getColumnState(Generic.searchType);
	Utilities.setupGrid(Generic.searchType);
	// ContactWizard.serachResult();
	ContactWizard.resetControls();
	ContactWizard.populateUserSpecialism();
});

var ContactWizard = ContactWizard || {};

ContactWizard.helpTextIndex = 0;
ContactWizard.helpText = [];
ContactWizard.helpText[0] = "<p>Welcome! This sales wizard  will help you  to  sell your candidate by finding  the contacts most likely to interview them.</p>"
		+ "<p>First, lets's check we have the right specialism and location: they should match the specialism of the candidate you are selling and where they want to work.</p>"
		+ '<p>Then click "Next"</p>';
ContactWizard.helpText[1] = '<p>Now, what is the job category or categories of your candidate?</p>'
		+ '<p>We will use this information to prioritise contacts who have registered jobs for similar candidates in the past.</p>'
		+ '<p>If you want to exclude any types of contacts from your results (e.g. HR) insert them in the "must not include" box.</p><br>'
		+ '<p>Then click "Next"</p>';
ContactWizard.helpText[2] = '<p>What kind of job is the candidate looking for ? You can include up to 3 different job titles they are interested in.</p>'
		+ '<p>We will use this information to prioritise contacts who registered jobs for similar candidates in the past.</p><br>'
		+ '<p>Then click "Next"</p>';
ContactWizard.helpText[3] = '<p>Finally what industry or industries has the candidate worked in.'
		+ '<p>You can select one or multiple industries from the "organisation type" list.</p>'
		+ '<p>We will use this information to prioritise contacts who work in these industries, as they are more likely to be interested in the candidate.</p>'
		+ '</p><br>Then click "Run" to see your results</p>';
ContactWizard.helpText[4] = '<p>Here are your results'
		+ '<p>The results are in order of priority.  The first on the list is the most likely to be interested in this candidate, based on the information you have given us and what we know about the contact.'
		+ ' If there are not enough contacts, you can re-run the search with wider criteria. If there are too many, you can re-run the search with narrower '
		+ 'criteria. You can now convert this into a BD list or an e-shot list or take other actions by clicking on the <span class=\"help-gear\"></span> icon in the top right hand corner.</p>';

ContactWizard.searchData = [];
ContactWizard.searchData.jobTitle = [];
ContactWizard.userName = '';
ContactWizard.colModelList = [];
ContactWizard.colNameList = [];
ContactWizard.resultCnt = 1000;
ContactWizard.li_clickCount = 0;
ContactWizard.filterFields = '';
ContactWizard.squarialInmetaStr = '';
ContactWizard.idsOfSelectedRows = [];
ContactWizard.numRecords = 10;
ContactWizard.increment = 5;
ContactWizard.displayCount = 200;
ContactWizard.controlName = '';

ContactWizard.getUrlParams = function() {
	Generic.searchType = Utilities.getUrlVars('searchType');
	Generic.userId = Utilities.getUrlVars('UserRefNUM');
	Generic.userProfile = Utilities.getUrlVars('Profile');
	FindMe.urlParams.searchType = Generic.searchType;
	FindMe.urlParams.userId = Generic.userId;
};

ContactWizard.populateUserSpecialism = function() {
	$.ajax({
		url : "getUserSpecialism.do",
		type : 'GET',
		data : {
			"consultant" : Generic.userId
		},
		success : function(data, status, response) {
			var resp = JSON.parse(data);
			$("#BrandCD").attr("codeid", "\"" + resp.text + "\":" + resp.id)
					.val(resp.text + ", ");
		}
	});
};

ContactWizard.urlParams = function(searchType) {
	ContactWizard.searchTerm = '';
	ContactWizard.urlParams.keyword = '';
	ContactWizard.urlParams.reqJobTitle = '';
	ContactWizard.urlParams.partialJobTitle = '';
	ContactWizard.urlParams.partialFields = '';
	ContactWizard.urlParams.requiredFields = '';
	ContactWizard.referenceData = '';
	Generic.searchUrl = '';
	var dataArray = [];
	ContactWizard.errorMessages = [];
	ContactWizard.roleSearch = 'ALL';
	dataArray = ContactWizard.searchData;
	Query.buildQuery();
	/*
	 * gsaQuery = []; var requiredValue =
	 * Constants.appendReqParam[Generic.searchType];
	 * $(dataArray).each(function(index, object) { var condition =
	 * object.condition; var searchField = object.searchField; var searchValue =
	 * object.searchValue; var operator = object.operator; if(typeof operator ==
	 * 'undefined') operator = '.';
	 * 
	 * if($.trim(searchField) != 'JobTitle'){ if(condition == 'eq'){
	 * if(ContactWizard.urlParams.requiredFields != '')
	 * ContactWizard.urlParams.requiredFields += operator; if ((typeof
	 * ContactWizard.urlParams.requiredFields != 'undefined' &&
	 * ContactWizard.urlParams.requiredFields != '') && typeof searchValue !=
	 * 'undefined'){ var codeId = ContactWizard.getCodes(searchField,
	 * searchValue); var pfields = codeId.split(',');
	 * ContactWizard.urlParams.requiredFields +=
	 * Comman.getFilterString(searchField , pfields); } else if (typeof
	 * searchValue != 'undefined'){ var codeId =
	 * ContactWizard.getCodes(searchField, searchValue); var pfields =
	 * codeId.split(','); ContactWizard.urlParams.requiredFields +=
	 * Comman.getFilterString(searchField , pfields); } } else if(condition ==
	 * 'cn'){ if(ContactWizard.urlParams.partialFields != '')
	 * ContactWizard.urlParams.partialFields += operator; if ((typeof
	 * ContactWizard.urlParams.partialFields != 'undefined' &&
	 * ContactWizard.urlParams.partialFields != '')&& typeof searchValue !=
	 * 'undefined'){ var codeId = ContactWizard.getCodes(searchField,
	 * searchValue); var searchValArr = codeId.split(',');
	 * ContactWizard.urlParams.partialFields +=
	 * Comman.getFilterString(searchField , searchValArr); } else if (typeof
	 * searchValue != 'undefined' && searchValue != ''){ var codeId =
	 * ContactWizard.getCodes(searchField, searchValue); var searchValArr =
	 * codeId.split(','); ContactWizard.urlParams.partialFields +=
	 * Comman.getFilterString(searchField , searchValArr); } } else if(condition ==
	 * 'nt'){ if(ContactWizard.urlParams.keyword.indexOf('-inmeta'))
	 * ContactWizard.urlParams.keyword+="+-inmeta%3a"+searchField; else
	 * ContactWizard.urlParams.keyword+="-inmeta%3a"+searchField; } } });
	 * $(ContactWizard.searchData.jobTitle).each(function(index, object){ var
	 * condition = object.condition; var searchField = object.searchField; var
	 * searchValue = object.searchValue; var operator = object.operator;
	 * if($.trim(searchField) == 'JobTitle'){
	 * if(ContactWizard.urlParams.jobTitle != ''){
	 * ContactWizard.urlParams.jobTitle += operator; } if(condition == 'eg'){ if
	 * (ContactWizard.urlParams.reqJobTitle != '')
	 * ContactWizard.urlParams.reqJobTitle += operator;
	 * ContactWizard.urlParams.reqJobTitle += searchField+'%3a'+searchValue;
	 * }else if(condition == 'cn'){ if (ContactWizard.urlParams.partialJobTitle !=
	 * '') ContactWizard.urlParams.partialJobTitle += operator;
	 * ContactWizard.urlParams.partialJobTitle += searchField+'%3a'+searchValue;
	 * }else if (condition == 'nt'){ if (ContactWizard.urlParams.reqJobTitle !=
	 * '') ContactWizard.urlParams.reqJobTitle += operator;
	 * ContactWizard.urlParams.reqJobTitle += '-'+searchField+'%3a'+searchValue; } }
	 * }); if(ContactWizard.urlParams.partialJobTitle != ''){
	 * ContactWizard.urlParams.partialJobTitle =
	 * '('+ContactWizard.urlParams.partialJobTitle+')';
	 * if(ContactWizard.urlParams.partialFields != '')
	 * ContactWizard.urlParams.partialFields += '.';
	 * ContactWizard.urlParams.partialFields +=
	 * ContactWizard.urlParams.partialJobTitle; } if
	 * (ContactWizard.urlParams.reqJobTitle != ''){
	 * ContactWizard.urlParams.reqJobTitle =
	 * '('+ContactWizard.urlParams.reqJobTitle+')';
	 * if(ContactWizard.urlParams.requiredFields != '')
	 * ContactWizard.urlParams.requiredFields += '.';
	 * ContactWizard.urlParams.requiredFields +=
	 * ContactWizard.urlParams.reqJobTitle; } if (typeof
	 * ContactWizard.urlParams.requiredFields != 'undefined' &&
	 * ContactWizard.urlParams.requiredFields != '' &&
	 * Generic.searchUrl.indexOf('requiredfields') == -1) { requiredValue +=
	 * '.'+ContactWizard.urlParams.requiredFields; } // console.log('Partial
	 * Title--- '+ContactWizard.urlParams.partialJobTitle); //
	 * console.log('Required Title--- '+ContactWizard.urlParams.reqJobTitle); //
	 * console.log('Required --- '+ContactWizard.urlParams.requiredFields); //
	 * console.log('Partial ----'+ContactWizard.urlParams.partialFields);
	 * console.log(requiredValue); Generic.searchUrl = Constants.queryString
	 * +"&site=" + Constants.collection[Generic.searchType] +
	 * Constants.appendParam + requiredValue+
	 * "&start=0&num="+ContactWizard.resultCnt; if (typeof
	 * ContactWizard.urlParams.partialFields != 'undefined' &&
	 * ContactWizard.urlParams.partialFields != '' &&
	 * Generic.searchUrl.indexOf('partialfields') == -1) { Generic.searchUrl +=
	 * '&partialfields='+ContactWizard.urlParams.partialFields; }
	 * console.log('Final URL ----'+Generic.searchUrl);
	 */
};

ContactWizard.getCodes = function(key, value) {
	var codeIds = [];
	var sVal = "{" + value + "}";
	var jsonStr = JSON.parse(sVal);
	for (key in jsonStr) {
		codeIds.push($.trim(jsonStr[key]));
	}
	return codeIds.length == 0 ? value : codeIds.join(" , ");
};
ContactWizard.getCode = function(value) {
	var codeIds = [];
	var sVal = "{" + value + "}";
	var jsonStr = JSON.parse(sVal);
	$.each(jsonStr, function(index, object) {
		codeIds.push(object);
	});

	return codeIds;
};

// Generate code fields
ContactWizard.searchFilter = function() {
	controlName = $('#BrandCD').attr('id');
	ContactWizard.displayOperation(controlName);
	controlName = $('#OfficeCD').attr('id');
	ContactWizard.displayOperation(controlName);
	controlName = $('#jobCategoryHier').attr('id');
	ContactWizard.displayOperation(controlName);

	controlName = $('#organisationTypeHier').attr('id');
	ContactWizard.displayOperation(controlName);

	controlName = $('#mustNotInclude').attr('id');
	ContactWizard.displayOperation(controlName);

	// Delete codeid and codename attribute on empty field
	$('.search-tabs input.ui-autocomplete-input').on('change keyup paste',
			function() {
				if ($(this).val().length == 0) {
					$(this).removeAttr("codeid").removeAttr("codename");
				}
			});

};

ContactWizard.displayOperation = function(controlName) {
	var codeGroup = 'CODEGROUP_' + controlName + 'ID';
	// console.log('DynaCodeGroupID is : '+codeGroup);
	var codeGroupSearchString = 'CODE_AUTO_QUERY';

	ContactWizard.operaton(controlName, codeGroup, codeGroupSearchString);

};

ContactWizard.operaton = function(controlName, codeGroup, codeGroupSearchString) {
	Utilities.addFindCodes(controlName, codeGroup, codeGroupSearchString);
	$("#" + controlName + "Link")
			.click(
					function() {
						var opt = {
							autoOpen : false,
							modal : true,
							width : 400,
							height : 500,
							title : 'Select Code',
							buttons : {
								"OK" : function() {
									var inputFId = controlName;
									var selectedLocations = "";
									var selectedLocationIds = '';
									$('#locationsCodeData .jstree-clicked')
											.each(
													function(index, object) {

														var locationId = $(this)
																.parent('li')
																.attr('id');
														var locationDesc = object.text;
														// console.log(locationId);

														if (index == 0) {
															selectedLocations = locationDesc;
															selectedLocationIds = "\""
																	+ locationDesc
																	+ "\":"
																	+ locationId;

														} else {
															selectedLocations += ', '
																	+ locationDesc;
															selectedLocationIds += ', '
																	+ "\""
																	+ locationDesc
																	+ "\":"
																	+ locationId;
														}
													});
									$('#' + inputFId).attr('codeId',
											selectedLocationIds);
									if (selectedLocations != '')
										$('#' + inputFId).val(
												selectedLocations + ', ');
									$('#' + inputFId).data('value',
											selectedLocations);
									$('.overlay').removeClass('double-layer');
									$(this).dialog("close");
								},
								Cancel : function() {
									$(this).dialog("close");
								}
							}
						};
						$("#locationsCode").dialog(opt);
						$('.codesErrorMsg').html('');
						$('.overlay').addClass('double-layer');
						$('#locationsCode').data('opener', this).dialog('open');
						$('#locationsCode').css('z-index', 9999);
						if ($('#locationsCodeData').hasClass('jstree')) {
							$('#locationsCodeData').remove();
							$('#locationsCode').html(
									'<div id="locationsCodeData"></div>');
						}
						var codeGroup = 'CODEGROUP_' + controlName + 'Des';
						var codeGroupSearchString = 'CODE_QUERY';

						if (codeGroup == 'CODEGROUP_jobCategoryHierDes'
								|| codeGroup == 'CODEGROUP_mustNotIncludeDes') {
							codeGroupControl.generateCodesDynamic(codeGroup,
									codeGroupSearchString, 'locationsCodeData');
						} else {
							codeGroupControl.generateCodes(codeGroup,
									codeGroupSearchString, 'locationsCodeData');
						}

					});
};

ContactWizard.valueOfAndOr = function(name) {
	if (name == 'Or')
		return '|';
	else if (name == 'And')
		return '.';
};
ContactWizard.serachResult = function() {
	// $("#getContacts").click(function() {
	ContactWizard.searchData = [];
	ContactWizard.searchData.jobTitle = [];
	var jobLocationAndOr = ContactWizard.valueOfAndOr($(
			'#OfficeCDAndOr a.active').text());
	// console.log(JSON.stringify(ContactWizard.searchData));
	if ($('.btn-slct-all').hasClass('active'))
		$('.btn-slct-all').removeClass('active');
	var specialism = $('#BrandCD').attr('codeid');
	console.log(specialism);
	if (specialism != '' && typeof specialism != 'undefined') {
		ContactWizard.searchData.push({
			searchField : 'BrandCD',
			condition : 'cn',
			searchValue : specialism,
			operator : ''
		});
	}
	var location = $('#OfficeCD').attr('codeid');
	console.log(location);
	if (location != '' && typeof location != 'undefined') {
		ContactWizard.searchData.push({
			searchField : 'OfficeCD',
			condition : 'cn',
			searchValue : location,
			operator : jobLocationAndOr
		});
	}
	var jobCategories = $('#jobCategoryHier').attr('codeid');
	var jobCatValues = $('#jobCategoryHier').val();

	// console.log("jobCategories = "+jobCategories + ' jobCatValues =
	// '+jobCatValues);
	if (jobCategories != '' && typeof jobCategories != 'undefined') {
		ContactWizard.searchData.push({
			searchField : 'jobCategoryHier',
			condition : 'cn',
			searchValue : jobCategories,
			searchString : jobCatValues
		});
	}
	var organisationType = $('#organisationTypeHier').attr('codeid');
	console.log(organisationType);
	if (organisationType != '' && typeof organisationType != 'undefined') {
		ContactWizard.searchData.push({
			searchField : 'organisationTypeHier',
			condition : 'cn',
			searchValue : organisationType
		});
	}

	var mustNotInclude = $('#mustNotInclude').attr('codeid');
	var hrCatValues = $('#mustNotInclude').val();
	// console.log("mustNotInclude = "+mustNotInclude + ' VALUES =
	// '+hrCatValues);
	if (mustNotInclude != '' && typeof mustNotInclude != 'undefined') {
		ContactWizard.searchData.push({
			searchField : 'mustNotInclude',
			condition : 'cn',
			searchValue : mustNotInclude,
			searchString : hrCatValues
		});
	}

	var jobTitleGSATag = 'JobTitle';
	for (var i = 1; i <= 3; i++) {
		var jobTitleVal = $('#jobTitle' + i).val();
		var contition = $("#jobTitle" + i + "Compare li a.active ").attr("id");
		var jobTitleAndOr = 'Or';// ContactWizard.valueOfAndOr($("#jobTitle"+i+"AndOr
									// a.active").text());
		if (jobTitleVal != '' && typeof jobTitleVal != 'undefined') {
			ContactWizard.searchData.jobTitle.push({
				searchField : jobTitleGSATag,
				condition : contition,
				searchValue : jobTitleVal,
				operator : jobTitleAndOr
			});
		}
	}
	// alert(12);
	ContactWizard.urlParams();
	// Utilities.setupGrid(Generic.searchType,Generic.searchUrl);
	// Query.buildQuery();
	$('.search-fld-info div').html(
			ContactWizard.helpText[ContactWizard.helpTextIndex + 1]);
	// });
};

ContactWizard.extractCodes = function(codeString) {
	console.log('Code ID :' + codeString);
	var hdvalue = '';
	if (typeof codeString != 'undefined' && codeString != '') {
		var codes = codeString.split(', ');
		var codeIDS = '';
		$(codes).each(function(i, val) {
			console.log(i + ' - ' + val);
			if (i == 0)
				codeIDS += (codes[i].split(':'))[1];
			else
				codeIDS += ',' + (codes[i].split(':'))[1];
		});
		hdvalue = codeIDS;
	}
	console.log('final' + hdvalue);
	return hdvalue;
};

ContactWizard.createSearchCritXML = function() {
	var advancedFilters = '';
	var advancedFiltersXML = '';
	var searchXML = '';
	var BrandNames = $('#BrandCD').val();
	if (BrandNames != '') {
		var BrandIds = $('#BrandCD').attr('codeid');
		BrandIds = ContactWizard.extractCodes(BrandIds);
		advancedFilters += '<Row criteria="BrandCD" condition="" value="'
				+ BrandNames + '" searchIdTag="BrandCD" hdvalue="' + BrandIds
				+ '" operation="" valueto=""/>';
	}
	var OfficeNames = $('#OfficeCD').val();
	var officeCondition = '';
	if (OfficeNames != '') {
		officeCondition = $("#OfficeCDAndOr a.active").html();
		var OfficeIds = $('#OfficeCD').attr('codeid');
		OfficeIds = ContactWizard.extractCodes(OfficeIds);
		advancedFilters += '<Row criteria="OfficeCD" condition="" value="'
				+ OfficeNames + '" searchIdTag="OfficeCD" hdvalue="'
				+ OfficeIds + '" operation="' + officeCondition
				+ '" valueto=""/>';
	}
	var JobCategoryNames = $('#jobCategoryHier').val();
	if (JobCategoryNames != '') {
		var JobCategoryIds = $('#jobCategoryHier').attr('codeid');
		JobCategoryIds = ContactWizard.extractCodes(JobCategoryIds);
		console.log('JOb Codes' + JobCategoryIds);
		advancedFilters += '<Row criteria="jobCategoryHier" condition="" value="'
				+ JobCategoryNames
				+ '" searchIdTag="jobCategoryHier" hdvalue="'
				+ JobCategoryIds
				+ '" operation="" valueto=""/>';
	}
	var mustNotIncludeJobCat = $('#mustNotInclude').val();
	if (mustNotIncludeJobCat != '') {
		var mustNotIncludeJobCatIds = $('#mustNotInclude').attr('codeid');
		mustNotIncludeJobCatIds = ContactWizard
				.extractCodes(mustNotIncludeJobCatIds);
		advancedFilters += '<Row criteria="mustNotInclude" condition="'
				+ officeCondition + '" value="' + mustNotIncludeJobCat
				+ '" searchIdTag="mustNotInclude" hdvalue="'
				+ mustNotIncludeJobCatIds + '" operation="" valueto=""/>';
	}
	var organisationTypeNames = $('#organisationTypeHier').val();
	if (organisationTypeNames != '') {
		var organisationTypeIds = $('#organisationTypeHier').attr('codeid');
		organisationTypeIds = ContactWizard.extractCodes(organisationTypeIds);
		advancedFilters += '<Row criteria="organisationTypeHier" condition="'
				+ officeCondition + '" value="' + organisationTypeNames
				+ '" searchIdTag="organisationTypeHier" hdvalue="'
				+ organisationTypeIds + '" operation="" valueto=""/>';
	}
	for (var i = 1; i <= 3; i++) {
		var jobTitleVal = $('#jobTitle' + i).val();
		var contition = $("#jobTitle" + i + "Compare li a.active ").attr("id");
		var jobTitleAndOr = $("#jobTitle" + i + "AndOr a.active").html();
		if (typeof jobTitleAndOr == 'undefined')
			jobTitleAndOr = '';
		if (jobTitleVal != '' && typeof jobTitleVal != 'undefined') {
			advancedFilters += '<Row criteria="jobTitle' + i + '" condition="'
					+ contition + '" value="' + jobTitleVal
					+ '" searchIdTag="jobTitle' + i
					+ '" hdvalue="" operation="' + jobTitleAndOr
					+ '" valueto=""/>';
		}

	}
	advancedFiltersXML = '<Advance><Rows>' + advancedFilters
			+ '</Rows></Advance>';
	searchXML = '<search>' + advancedFiltersXML + '</search>';
	console.log('Final Generated XML  - ' + searchXML);
	return searchXML;

};
ContactWizard.validateFieldsBeforeCriteriaSave = function() {
	var isValid = false;
	$('.inputDivClass input[type=text]').each(function() {
		if ($(this).val() != '') {
			isValid = true;
			return isValid;
		}
	});
	return isValid;
};
ContactWizard.savedSearchCriteria = function(e) {
	var valid = ContactWizard.validateFieldsBeforeCriteriaSave();
	if (valid == false) {
		errorMessage.errorMessageDialog(errorMessage.validSaveCriteria);
	} else {
		var opt = {
			autoOpen : false,
			modal : false,
			width : 400,
			height : 250,
			title : 'Save Search Criteria',
			buttons : {
				"OK" : function() {

					var criteriaName = $('#criteriaName').val();
					$('#searchCritFrm').validate();

					if (criteriaName == '') {
						$('#searchCritFrm').submit();
						return false;
					}
					var filterXML = ContactWizard.createSearchCritXML();
					var url = "saveGoogleSearchCriteria.do?";
					console.log(criteriaName);
					console.log(filterXML);
					$
							.ajax({
								url : url,
								type : 'POST',
								async : false,
								data : {
									"consultant" : Generic.userId,
									"criteriaName" : criteriaName,
									"searchType" : Constants.SEARCH_TYPE[Generic.subSearchType],
									"advancedFilters" : filterXML
								},
								success : function(data, status, response) {
									console.log('CAME IN SUCCESS');
									errorMessage
											.errorMessageDialog(errorMessage.saveSearchCritSuccess);

								}
							});
					$(this).dialog("close");
				},
				"Cancel" : function() {
					$(this).dialog("close");
				}
			}
		};
		$("#searchCriteria").dialog(opt);
		$("#searchCriteria").dialog("open");
	}

};
ContactWizard.createsearchCritBox = function(dataAjax, criteria) {
	console.log(JSON.stringify(dataAjax));
	/*
	 * var criteria = $('#criteriaBox'); criteria.empty();
	 */
	// console.log(criteria.html());
	var searchCritBox = $('<ul></ul>');
	var liName = "";
	$(dataAjax)
			.each(
					function(index, val) {
						console.log(JSON.stringify(val));
						liName += "<li id ='" + val.queryId
								+ "'><a href='javascript:void(0)'>"
								+ val.criteriaName + "</a>";
						var advancedFilters = val.advancedFilters;
						var dlName = $('<dl></dl>');
						var jobTitle = '';
						var jobTitleComparator = '';
						var jobTitleAndOROperator = '';
						var jobTitleSearchId = '';
						$(advancedFilters)
								.each(
										function(idx, value) {
											if (value.metadata
													.indexOf('jobTitle') < 0) {
												dlName
														.append($('<dt></dt>')
																.html(
																		Constants.searchFilterHeader[value.metadata]));
												dlName
														.append($('<dd></dd>')
																.html(
																		value.metadataValue)
																.attr(
																		{
																			'codeid' : value.metaDataHdValue,
																			'searchIdTag' : value.metadata,
																			'andOROperator' : value.andOROperator,
																			'comparator' : value.comparator
																		}));
											} else {
												if (jobTitle != '')
													jobTitle += ',';
												jobTitle += value.metadataValue;
												if (jobTitleComparator != '')
													jobTitleComparator += ',';
												jobTitleComparator += value.comparator;
												if (jobTitleAndOROperator != '')
													jobTitleAndOROperator += ',';
												jobTitleAndOROperator += value.andOROperator;
												if (jobTitleSearchId != '')
													jobTitleSearchId += ',';
												jobTitleSearchId += value.metadata;
											}

										});
						if (jobTitle != '') {
							dlName.append($('<dt></dt>').html('Job Title'));
							dlName.append($('<dd></dd>').html(jobTitle).attr({
								'codeid' : '',
								'searchIdTag' : jobTitleSearchId,
								'andOROperator' : jobTitleAndOROperator,
								'comparator' : jobTitleComparator
							}));
						}
						dlName.append($('<a></a>').attr("href",
								"javascript:void(0)").addClass('search-btn'));
						dlName.append($('<a></a>').attr("href",
								"javascript:void(0)").addClass('delete-btn')
								.text('Delete'));

						liName += "<dl>" + dlName.html() + "</dl></li>";
					});
	searchCritBox.html(liName);
	criteria.append(searchCritBox);
	// Delete Criteria
	$('.saved-search-area dl > a.delete-btn').click(function(e) {
		// alert('delete');
		ContactWizard.deleteSearchCriteria();
		e.preventDefault();
	});
	// Saved Search
	$('.saved-search-area li > a').click(
			function(e) {
				// alert('saved');
				$(this).parent('li').siblings('li').each(
						function(index, element) {
							if ($(element).children('a').hasClass('active'))
								$(element).children('a').toggleClass('active')
										.next('dl').slideToggle(300);
						});
				$('.search-menu-dropdown').slideUp(300);
				$(this).toggleClass('active').next('dl').slideToggle(300);
				e.preventDefault();
				e.stopPropagation();
			});
	$('a.search-btn').click(function(e) {
		// alert('called');
		$('#overlay-loading').show();
		$('.page, .facet-menu').fadeIn(500);
		var alldd = $(this).siblings('dd');
		ContactWizard.resetControls();
		for (var i = 0; i < alldd.length; i++) {
			if ($(alldd[i]).attr('searchidtag').indexOf('jobTitle') == -1) {
				ContactWizard.populateValuesInField($(alldd[i]));
			} else {
				ContactWizard.populateJobTitleInField($(alldd[i]));
			}
		}

		// alert($('.saved-search-area li > a').length);
		/*
		 * $('.saved-search-area li > a').each(function(index, val) { var
		 * condition = ''; if($(this).hasClass('active')){ // alert('active');
		 * $(this).siblings().find('dd').each(function(index, val) { var metaTag =
		 * $(this).attr('searchidtag'); console.log('Meta Tag = '+metaTag);
		 * if(metaTag != ''){ var metaTagValue =
		 * $(this).attr('codeid');//text(); var metaTagString = $(this).text();
		 * var mValue = '('; var values = metaTagValue.split(',');
		 * 
		 * $.each(values,function(index,value){ if(index == 0) { mValue +=
		 * metaTag + ":"+value; } else { mValue += "|"+metaTag + ":"+value; }
		 * });
		 * 
		 * mValue += ")"; console.log('RETRIEVED VALUES = '+metaTag + ' value
		 * '+mValue + ' string '+metaTagString);
		 * ContactWizard.searchData.push({searchField:metaTag,
		 * condition:condition, searchValue:mValue ,
		 * searchString:metaTagString}); } }); } });
		 */
		var condition = '';
		// ContactWizard.searchData = [];
		ContactWizard.serachResult();
		// if($(this).hasClass('active')){
		// alert('active');
		/*
		 * $(alldd).each(function(index, val) { var metaTag =
		 * $(val).attr('searchidtag'); console.log('Meta Tag = '+metaTag);
		 * if(metaTag != '' && metaTag.indexOf('jobTitle') == -1){ var
		 * metaTagValue = $(val).attr('codeid');//text(); var metaTagString =
		 * $(val).text(); var mValue = '('; var values =
		 * metaTagValue.split(',');
		 * 
		 * $.each(values,function(index,value){ if(index == 0) { mValue +=
		 * metaTag + ":"+value; } else { mValue += "|"+metaTag + ":"+value; }
		 * });
		 * 
		 * mValue += ")"; console.log('RETRIEVED VALUES = '+metaTag + ' value
		 * '+mValue + ' string '+metaTagString);
		 * 
		 * ContactWizard.searchData.push({searchField:metaTag,
		 * condition:condition, searchValue:mValue ,
		 * searchString:metaTagString}); }else{ var metaTagComparator =
		 * $(val).attr('comparator').split(','); var metaTagString =
		 * $(val).text().split(','); var values = metaTagComparator.split(',');
		 * $(metaTagString).each(function(index, object){
		 * ContactWizard.searchData.jobTitle.push({searchField:'JobTitle',
		 * condition:metaTagComparator[index], searchValue:metaTagString[index] ,
		 * searchString:metaTagString}); }); } });
		 */
		// }
		// Query.buildQuery();
		// Query.populateValues();
		$('.saved-search-area').hide();
		$('.input-search').show();
		$('.reset-search-btn').show();
		// $('#getContacts').trigger('click');
		// e.preventDefault();
	});

};
ContactWizard.deleteSearchCriteria = function() {
	var url = "deleteGoogleSearchCriteria.do?";

	var criteriaId = '';
	var criteriaObj = '';
	$('.saved-search-area li > a').each(function(index, val) {

		if ($(this).hasClass('active')) {
			criteriaObj = $(this).parent();
			console.log('Criteria Name = ' + $(this).parent().attr('id'));
			criteriaId = $(this).parent().attr('id');
		}
	});
	$.ajax({
		url : url,
		type : 'GET',
		async : false,
		data : {
			"consultant" : Generic.userId,
			"criteriaId" : criteriaId
		},
		success : function(data, status, response) {
			criteriaObj.remove();
		}

	});
};
ContactWizard.populateValuesInField = function(value) {
	var fieldValue = value.text();
	var searchIdTag = value.attr('searchidtag');
	var codeId = value.attr('codeid');
	var andOROperator = value.attr('andOROperator');
	console.log(fieldValue + '---' + searchIdTag + '---' + codeId + '---'
			+ andOROperator);
	// var comparator = value.attr('comparator');
	$('#' + searchIdTag).val(fieldValue);
	$('#' + searchIdTag + andOROperator).siblings().removeClass('active');
	$('#' + searchIdTag + andOROperator).addClass('active');
	var codeIDDes = ContactWizard.joinCodeWithDesc(fieldValue, codeId);
	$('#' + searchIdTag).attr('codeid', codeIDDes);
};

ContactWizard.joinCodeWithDesc = function(desc, codes) {
	var des = [];
	if (typeof desc != 'undefined')
		des = desc.split(',');
	var codesArr = codes.split(',');
	var codeDesc = '';
	$.each(codesArr, function(index, val) {
		if (codeDesc != '')
			codeDesc += ',';
		codeDesc += '"' + des[index] + '":' + codesArr[index];
	});
	console.log('Final Code ID --' + codeDesc);
	return codeDesc;
};
ContactWizard.populateJobTitleInField = function(value) {
	var fieldValue = value.text().split(',');
	var searchIdTag = value.attr('searchidtag').split(',');
	var andOROperator = value.attr('andOROperator').split(',');

	var comparator = value.attr('comparator').split(',');
	$.each(fieldValue, function(i, value) {
		$('#' + searchIdTag[i]).val(fieldValue[i]);
		$('#' + searchIdTag[i] + 'Compare  a.active').removeClass('active');
		$('#' + searchIdTag[i] + 'Compare #' + comparator[i])
				.addClass('active');
		if (!andOROperator[i]) {
			$('#' + searchIdTag[i] + 'AndOr > a.active').removeClass('active');
			$('#' + searchIdTag[i] + 'AndOr a[id=' + andOROperator[i] + ']')
					.addClass('active');
		}
	});
};
ContactWizard.displaySearchCriteria = function(user, criteriaName) {
	var url = "getGoogleSearchCriteria.do?";
	$.ajax({
		url : url,
		type : 'POST',
		async : false,
		data : {
			"consultant" : user,
			"criteriaName" : criteriaName,
			"searchType" : Constants.SEARCH_TYPE[Generic.subSearchType]
		},
		success : function(data, status, response) {
			dataAjax = JSON.parse(data);
			var criteria = $('#criteriaBox');
			criteria.empty();
			if (dataAjax.length > 0) {
				console.log('Length is::' + dataAjax.length);
				ContactWizard.createsearchCritBox(dataAjax, criteria);
			}
		}
	});
};
ContactWizard.resetControls = function() {
	$('.inputDivClass input[type=text]').val('');
	$('.inputDivClass input[type=text]').removeAttr('codeid');
	$('.and-or-btn a').removeClass('active');
	$('.and-or-btn a#And').addClass('active');
	$('.input-opt li a').removeClass('active');
	$('.input-opt li a#cn').addClass('active');
};

ContactWizard.pageSetUp = function() {
	// $('#overlay-loading').hide();
	$("#getContacts").click(function() {
		$('#overlay-loading').show();
		ContactWizard.serachResult();
	});
	// Saved Search
	$('.search-menu-dropdown li > a').click(function(e) {
		var option = $.trim($(this).text());
		if (option == 'Save Search Criteria') {
			$('#criteriaName').val('');
			ContactWizard.savedSearchCriteria(e);
		} else if (option == 'Save Search Results') {
			$('#searchName').val('');
			Utilities.saveSearchResults(e);
		} else if (option == 'Add To Target List') {
			Utilities.addToTargetList();
		} else if (option == 'Longlist Candidates')
			FindMe.longlistCands();
		else if (option == 'Generate Eshot List')
			Comman.eshotList();
		else if (option == 'Generate BD List')
			Comman.bdCallList();
		else if (option == 'Select Columns') {
			$("#dataTable").jqGrid('columnChooser', {
				done : function(perm) {
					if (perm) {
						Utilities.saveColumnState.call(this, perm);
					}
				}
			});
		}
		// Added for contacts
		else if (option == 'Send Web Candidate') {
			FindMe.sendWebCandidate();
		}
		$(this).toggleClass('active').parent().parent().slideToggle(300);
		e.preventDefault();
	});

	// First and Last
	$('ul > li:first-child, table.data-table tr td:first-child').addClass(
			'first');
	$('ul > li:last-child, table.data-table tr td:last-child').addClass('last');

	// Tab
	$('.search-tabs .tab li a').click(
			function(e) {
				var tabIndex = $(this).parent('li').index();
				$(this).parents('.tab').children('li').removeClass('active');
				$(this).parents('.search-tabs').children('.tab-content')
						.children('li').removeClass('active');
				$(this).parent('li').addClass('active');
				$(this).parents('.search-tabs').children('.tab-content')
						.children('li').eq(tabIndex).addClass('active');
				tabSelection();
				e.preventDefault();
			});

	$('.search-tabs .tab li:first, .search-tabs .tab-content li:first')
			.addClass('active');

	// Saved Search Button
	$('.saved-search-btn a').click(
			function(e) {
				// alert('Click = '+$(this).parent().hasClass('active'));
				if ($(this).parent().hasClass('active')) {
					$(this).attr('title', 'Browse Saved Search Criterias')
							.parent().removeClass('active').parents('li')
							.children('.input-search').fadeIn(500).next(
									'.saved-search-area').hide();
					$('.reset-search-btn').show();
				} else {
					$(this).attr('title', 'Back to Normal Search').parent()
							.addClass('active').parents('li').children(
									'.input-search').hide().next(
									'.saved-search-area').fadeIn(500);
					ContactWizard.displaySearchCriteria(Generic.userId, 'ALL');
					$('.reset-search-btn').hide();
				}
				e.preventDefault();
			});

	// Facet Menu
	$('.facet-menu').click(function(e) {
		Comman.createFilter();
		$('body').addClass('facet-active');
		e.stopPropagation();
		e.preventDefault();
	});

	$('.overlay').click(function(e) {
		$('body').removeClass('facet-active');
		$('.facet').find('.clear-all-btn').show();
	});

	// Search Button Wrap
	$('.input-search input[type="submit"]').parent('li').addClass(
			'search-action');

	// Advanced Filter
	$('.filter-btn').click(function(e) {
		$(this).toggleClass('active').next('div').slideToggle(100);
		e.preventDefault();
	});
	// Add
	$(document).on(
			'click',
			'.filter-ctrl-btn.add-btn',
			function(e) {
				$(this).parent('div').parent('li').clone().appendTo(
						'.advance-filter ul');
				e.preventDefault();
			});
	// Remove
	$(document).on('click', '.filter-ctrl-btn.remove-btn', function(e) {
		if ($(this).parents('.advance-filter').find('li').length > 1) {
			$(this).parent('div').parent('li').remove();
		}
		e.preventDefault();
	});

	// Input Opt
	if ($('.input-opt').length > 0) {
		$('.input-opt > a').click(function(e) {
			$(this).toggleClass('active').next('ul').fadeToggle(100);
			e.stopPropagation();
			e.preventDefault();
		});
		$('body').click(function(e) {
			$('.input-opt-dropdown').fadeOut(100);

		});
		$('.input-opt').children('ul').addClass('input-opt-dropdown').find('a')
				.click(
						function(e) {
							$(this).parents('.input-opt-dropdown').find('a')
									.removeClass('active');
							$(this).toggleClass('active');
							e.preventDefault();
						});
	}

	$('body').click(function(e) {
		$('.search-menu-dropdown').slideUp(300);
		$('.saved-search-area li a').each(function(index, element) {
			if ($(element).hasClass('active'))
				$(element).removeClass('active').next('dl').slideToggle(300);
		});
	});

	// And Or Btn
	$('.and-or-btn a').click(function(e) {
		$(this).parent('.and-or-btn').find('a').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	if ($('.and-or-btn').length > 0) {
		$('.and-or-btn').parent('li').addClass('compact-cell');
	}
	if ($('.prev-step-btn').length > 0) {
		$('.prev-step-btn').parent('li').addClass('compact-cell');
	}

	// Default help text
	$('.search-fld-info div').html(
			ContactWizard.helpText[ContactWizard.helpTextIndex]);

	// multi-step-search
	if ($('.input-search > ul').length > 1) {
		$('.input-search').addClass('multi-step-search').children(
				'ul:first-child').addClass('active');
	}
	$('.multi-step-search .next-step-btn').click(
			function(e) {
				$(this).parents('ul').removeClass('active').next('ul')
						.addClass('active');
				$('.search-fld-info div').html(
						ContactWizard.helpText[++ContactWizard.helpTextIndex]);
				e.preventDefault();
			});
	$('.multi-step-search .prev-step-btn').click(
			function(e) {
				$(this).parents('ul').removeClass('active').prev('ul')
						.addClass('active');
				$('.search-fld-info div').html(
						ContactWizard.helpText[--ContactWizard.helpTextIndex]);
				e.preventDefault();
			});

	// Reset Search Filters
	$('.reset-search-btn a').click(function() {
		// alert('click called');
		$('.input-search ul').removeClass('active');
		$('.input-search ul').first().addClass('active');
		ContactWizard.resetControls();
	});

	// Chart
	$('.findme-chart > table td').click(function(e) {
		if ($(this).children('a').length > 0) {
			// do nothing
		} else {
			$(this).parent('tr').toggleClass('selected');
		}
	});

	if ($('.data-table').length > 0) {
		if ($('.data-table th span').length > 0) {
			$('.data-table th span:first-child').addClass('heading');
			$('.data-table th span:last-child').addClass('input');
			$('.heading a').click(function(e) {
				$(this).parent('span').hide();
				$(this).parent('span').next('span').show();
				e.preventDefault();
			});
			$('.input a').click(function(e) {
				$(this).parent('span').hide();
				$(this).parent('span').prev('span').show();
				e.preventDefault();
			});
		}
	}

	// Responsive Table
	if (jQuery('table.data-table').length > 0) {
		var arr = [];
		var classes = [];
		if (jQuery('table.data-table').length > 0) {
			jQuery('table.data-table').each(
					function() {
						var i = 0;
						arr = [];
						classes = [];
						jQuery('th', this).each(function() {
							arr[i] = jQuery(this).text();
							classes[i] = jQuery(this).attr('class');
							i++;
						});
						jQuery('tr', this).each(
								function() {
									for (var j = 0; j < arr.length; j++) {
										k = j + 1;
										jQuery(this).children(
												'td:nth-child(' + k + ')')
												.attr('data-th', arr[j]);
										jQuery(this).children(
												'td:nth-child(' + k + ')')
												.attr('class', classes[j]);
									}
								});
					});
		}
	}

};

function resetBrowseOptions() {
	$('.custom-select-box strong').text('Please Select One');
	$('.custom-select-box li').removeClass('custom-select-active');
	$('.custom-radio-btn span').removeClass('active');
	$('.selected-info').hide();
	$('.overlay').remove();
	$('.browse-options-wrapper ul li:not(:first-child)').addClass('disabled');
	$('.browse-options-wrapper').animate({
		bottom : '-3000px'
	}, 600).hide();
}