// Get the url endpoint
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//create a function to feed the sample metadata
function sampleTesting(sample) {
  // Fetch the JSON data and console log it
  d3.json(url).then(function (data) {
    // Obtaining all metadata
    let metaData = data.metadata;
    // filter sample's data by id:
    let outcome = metaData.filter(
      (sampleOutcome) => sampleOutcome.id == sample
    );

    //checking data array
    let outcome1 = outcome[0];

    //clear an existing data if any
    d3.select("#sample-metadata").html("");

    Object.entries(outcome1).forEach(([key, value]) => {
      d3.select("#sample-metadata")
        .append("h5")
        .text(`${key.toLowerCase()}:${value}`);
    })
  });
}

// ----Create a horizontal bar chart

function barcharts(sample) {
  // Fetch the JSON data and console log it
  d3.json(url).then(function (data) {
    let samplesdata = data.samples;

    // filter sample's data by id:
    let outcome = samplesdata.filter(
      (sampleOutcome) => sampleOutcome.id == sample
    );

    //checking data array
    let outcome1 = outcome[0];

    //pull data from sample_values, otu_ids, otu_labels
    let sample_value = outcome1.sample_values;
    let otu_id = outcome1.otu_ids;
    let otu_label = outcome1.otu_labels;

    // create a horizontal bar chart with a dropdown menu
    //getting id label for the bar chart, then backward the data from largest to smallest for the first 10 OTUs
    let yticks = otu_id
      .slice(0, 10)
      .map((object) => `OTU ${object}`)
      .reverse();
    // adding the values for the barchart
    let xticks = sample_value.slice(0, 10).reverse();
    // adding label for the chart when hovertext
    let labels = otu_label.slice(0, 10);

    let trace = {
      y: yticks,
      x: xticks,
      text: labels,
      type: "bar",
      orientation: "h",
    };

    let layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100,
      },
    };

    //using Plotly to draw a chart
    Plotly.newPlot("bar", [trace], layout);

    //create a bubble chart
    let bubble_chart = {
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: "markers",
      marker: {
        color: otu_id,
        size: sample_value,
      },
    };

    //create layer:
    let layout1 = {
      title: "Microbial Species",
      hovermode: "closest",
      xaxis: {
        title: "OTU ID",
      },
    };
    Plotly.newPlot("bubble", [bubble_chart], layout1);
  });
}

//create a startup function
function startup() {
  // Load data from json file
  let data = d3.json(url);

  // Access the dropdown selector from index.html
  let select = d3.select("#selDataset");

  data.then((data) => {
    let samplenames = data.names;

    // loading sample to chart and demographic info
    samplenames.forEach((sample) => {
      select.append("option").text(sample).property("value", sample);
    });

    let sample1 = samplenames[0];

    // Calling function to sampleTesting
    sampleTesting(sample1);

    // Calling function to build barchart & bubble chart
    barcharts(sample1);
  });
}
// Function to update drop down when selection changes
function optionChanged(item) {
  // Calls function to update metadata
  sampleTesting(item),
    // Calls function to build the bar chart
    barcharts(item);
}

// Call start function
startup();
