const heightSlider = new Slider("#height", { tooltip: "always" });
const animationSlider = new Slider("#animation", { tooltip: "always" });
heightSlider.on("change", event => {
  draw();
});

animationSlider.on("change", event => {
  draw();
});

// Initializing height and tree variables
d3
  .select("#userTree")
  .property(
    "value",
    "((((((((((((((((((((((Fagus:95.1,Carya:95.1):7.589938,Cucumis:102.68994):0.991322,Morus:103.68126):0.643278,Pisum:104.32454):2.032216,((Parnassia:98.750046,Oxalis:98.750046):1.712544,Populus:100.462585):5.894165):0.00128,Bulnesia:106.35803):2.41062,((((((Gossypium:84.47311,Cleome:84.47311):11.118127,Tapiscia:95.59123):2.779864,Acer:98.37109):7.760231,Picramnia:106.131325):1.199301,Crossosoma:107.33063):0.862363,((Terminalia:87.3,Eucalyptus:87.3):17.705576,Pelargonium:105.00558):3.187415):0.575665):4.381711,(((Itea:50.703365,Pterostemon:50.703365):43.54422,Liquidambar:94.24759):17.264275,Vitis:111.51186):1.638504):0.809405,Dillenia:113.95977):0.649031,((((((((((((Paracryphia:52.490395,Lonicera:52.490395):3.74022,Daucus:56.230614):0.317339,Brunia:56.547955):0.438631,Escallonia:56.986588):24.54444,Helianthus:81.53103):6.114358,(Ilex:66.5,Helwingia:66.5):21.145384):4.077858,(((Antirrhinum:60.68952,Nicotiana:60.68952):2.351834,Nerium:63.041355):20.26629,Aucuba:83.30765):8.415594):5.050216,Enkianthus:96.77345):1.506261,(Cornus:87.3,Grubbia:87.3):10.979717):7.807598,Spinacia:106.08732):6.533299,Berberidopsis:112.62061):1.110552,Ximenia:113.73116):0.877635):1.110502,Gunnera:115.7193):6.201286,Pachysandra:121.92059):0.89091,Trochodendron:122.8115):1.818607,((Platanus:107.3,Nelumbo:107.3):16.168238,Meliosma:123.46824):1.161869):1.869893,(((Coptis:100.372314,Cocculus:100.372314):19.248432,Papaver:119.62075):1.61306,Euptelea:121.23381):5.26619):4.856025,Ceratophyllum:131.35602):1.517098,((((((((((Typha:61.068348,Sparganium:61.068348):24.390734,Oryza:85.45908):15.234818,(Musa:90.70971,Eichhornia:90.70971):9.984187):1.595022,(Serenoa:87.0,Calamus:87.0):15.288921):3.789045,Apostasia:106.077965):2.237676,Lilium:108.31564):1.637316,(Pandanus:107.51273,Dioscorea:107.51273):2.440223):5.187115,Japonolirion:115.140076):8.556882,(Spathiphyllum:113.5,Orontium:113.5):10.196955):3.339147,Acorus:127.0361):5.837022):0.164182,((((((Saururus:75.527534,Piper:75.527534):45.92045,Asarum:121.44798):8.940091,(Drimys:126.5,Canella:126.5):3.888077):1.096029,(((Hedycarya:101.1,Persea:101.1):2.339544,Atherosperma:103.439545):3.860456,Calycanthus:107.3):24.184107):0.185027,((Magnolia:87.721115,Liriodendron:87.721115):27.778889,Eupomatia:115.5):16.169132):1.098512,((Chloranthus:115.55476,Ascarina:115.55476):7.468146,Hedyosmum:123.0229):9.744738):0.26966):2.669566,(((Illicium:106.80325,Schisandra:106.80325):19.696749,Trimenia:126.5):4.163047,Austrobaileya:130.66304):5.043825):2.395419,(((Nuphar:86.827286,Nymphaea:86.827286):8.061111,Brasenia:94.88839):31.611607,Trithuria:126.5):11.60229):1.89771,Amborella:140.0):177.16982,(((((((((Juniperus:28.909595,Cupressus:28.909595):76.431274,Cryptomeria:105.34087):15.171681,Sequoia:120.51255):77.98745,(Taxus:180.22873,Torreya:180.22873):18.271276):40.048042,((Podocarpus:94.51272,Phyllocladus:94.51272):119.98728,Araucaria:214.5):24.04804):25.673899,(((Picea:78.557785,Pinus:78.557785):22.871145,Abies:101.428925):7.969642,Cedrus:109.39857):154.82336):11.159094,((Gnetum:115.5,Welwitschia:115.5):38.984795,Ephedra:154.4848):120.89624):17.5573,Ginkgo:292.93832):8.061667,((Zamia:172.42001,Encephalartos:172.42001):75.73096,Cycas:248.15097):52.84903):16.169813);"
  );
// Tree taken from Beaulieu et al. (2015) Heterogeneous rates of molecular evolution and diversification could explain the Triassic age estimate for angiosperms. Systematic Biology
// https://academic.oup.com/sysbio/article/64/5/869/1685167

// I'm rewriting this function to make it reactive like I did in coalescent. Hence it should carry internal state of values need to create tree structure and plot.
function draw() {

  function clear(){
    d3
    .select("body")
    .select("#phylosvg")
    .remove();
  d3
    .select("body")
    .select("#LTTsvg")
    .remove();
  d3
    .select("#LTTsvg")
    .selectAll("line")
    .remove();
  }
  
  clear()

  // Initializing animation time and plot heights
  var inputTime = animationSlider.getValue();
  var height = heightSlider.getValue();

  // color
  const COLOR = "orange";
  const tree = d3.select("#userTree").property("value");
  // Initializes tree with current value associated with input box.
  myTree = new Tree(tree);

  // Creates initial Animated Line object, which consists of a phylogram
  // plus an animation line.
  myAnimatedLine = new AnimatedLineOverTree(
    myTree,
    (w = 1000),
    (h = height),
    (scale = 0.8),
    (padding = 50),
    (lwd = 2),
    (color = COLOR),
    (moveTime = inputTime),
    (tipLabels = false)
  );

  myLTT = new AnimatedLTT(
    myTree,
    (w = 1000),
    (h = height),
    (scale = 0.8),
    (padding = 50),
    (lwd = 4),
    (color = COLOR),
    (plotTime = inputTime)
  );

  d3.select("#phylosvg").on("click", function(){
    playAnimation()
  });
}
  // This event listener is here, rather than in the Animated Line constructor,
  // because I can't figure out how to reference variables in that Animated Line
  // instance to pass to the function attached to the event listener. "this" doesn't
  // work in that context. By placing the event listener after the object instantiation
  // these variables can be passed directly.
  function playAnimation(){
    reset()
    moveLine(
      myAnimatedLine.lineX,
      myAnimatedLine.svg,
      myAnimatedLine.finalX,
      myAnimatedLine.moveTime
    );

        // Activates LTT animation
    for (var i = 1; i < myLTT.nodeXvals.length; i++) {
      // Iterates through unique x coordinates
      window.setTimeout(
        drawLTTLines, // Name of function to call
        myLTT.plotTime * myLTT.nodeXvals[i], // Delay time
        myLTT.nodeXvals[i - 1],
        myLTT.nodeXvals[i], // Function arguments
        myLTT.lineageCounts[i - 1],
        myLTT.lineageCounts[i],
        myLTT.svg,
        myLTT.xScale,
        myLTT.yScale,
        myLTT.color
      );
    }
  }

// Calls this function on initial page load to create first version of all graphics and text
draw();

function reset(){
    // Sets actions for "Reset" button.
  d3
    .select("#LTTsvg")
    .selectAll("line")
    .remove();
  d3
    .select("#progressLine")
    .attr("x1", myAnimatedLine.padding)
    .attr("x2", myAnimatedLine.padding);
}

d3.select("#reset").on("click", function() {
  reset()
});

d3.select("#readTree").on("click", function() {
  draw();
});