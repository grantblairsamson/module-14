// URL for the samples.json data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to initialize the dashboard
function init() {
  let selector = d3.select("#selDataset");

  // Fetch the data from the JSON file
  d3.json(url).then((data) => {
    let sampleNames = data.names;

    // Populate the dropdown with test subject IDs
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to build the charts (bar and bubble)
function buildCharts(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples.filter((obj) => obj.id === sample)[0];

    // Build Bar Chart
    let barData = [{
      x: samples.sample_values.slice(0, 10).reverse(),
      y: samples.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse(),
      text: samples.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Build Bubble Chart
    let bubbleData = [{
      x: samples.otu_ids,
      y: samples.sample_values,
      text: samples.otu_labels,
      mode: "markers",
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids,
        colorscale: "Earth"
      }
    }];

    let bubbleLayout = {
      title: "OTUs in Samples",
      xaxis: { title: "OTU ID" },
      margin: { t: 0 },
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to build the metadata
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata.filter((obj) => obj.id == sample)[0];
    let panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Add new metadata
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function that gets triggered when a new sample is selected
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();