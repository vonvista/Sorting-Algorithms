var controlsHeight = document.getElementById("controlMain").offsetHeight 
p5.disableFriendlyErrors = true; // disables FES

var oscPitch = 2.5

var algoPage = 0;

var algoPages = []

const algoPage1 = document.getElementById("algoPage1")
const algoPage2 = document.getElementById("algoPage2")

algoPages.push(algoPage1)
algoPages.push(algoPage2)

algoPage2.style.display = "none"

var animSpeed = 4
const easing = 0.05 * animSpeed

//COLORS
const YELLOW = [255, 242, 0]
const WHITE = [255,255,255]
const BASE_DARKBLUE = [28,42,53]

const VISITED_COLOR = [32,98,149]
const TRAVERSAL_OUTLINE = [255,157,0]

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

//FUNCTION FOR NAV OF ALGOS

function handleLeftAlgo() {
  if(algoPage > 0){

    algoPages[algoPage].style.display = "none";

    algoPage--

    algoPages[algoPage].style.display = "flex";
  }
}

function handleRightAlgo() {
  if(algoPage < algoPages.length - 1){

    algoPages[algoPage].style.display = "none";

    algoPage++

    algoPages[algoPage].style.display = "flex";
  }
}

//FUNCTION OF ADJUSTMENTS

function handleAdj() {
  var newSize = document.getElementById("sizeAdj")
  var newFrame = parseInt(document.getElementById("arrFrameAdj").value)
  
  sortOffsetX = newFrame
  sortOffsetY = newFrame

  sortWidth = width - sortOffsetX
  sortHeight = height - sortOffsetY
  

  if(parseInt(newSize.value) >= parseInt(newSize.min) && parseInt(newSize.value) <= parseInt(newSize.max)){

    arr = []
    arrState = []

    for(let i = 1; i < (parseInt(newSize.value) + 1); i++){
      arr.push(i)
      arrState.push(0)
    }

  }
  else {
    alert("Invalid size: Please input value between " + newSize.min + " and " + newSize.max)
  }
}

//FUNCTION FOR ANIMATION SLIDER

var buttonControls = document.getElementsByClassName("controlButton");

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  //statusText = "Standby"
}

document.getElementById("animSlider").innerHTML = document.getElementById("myRange").value
animSpeed = document.getElementById("myRange").value

function handleSliderAnimChange() {
  output = document.getElementById("myRange").value
  document.getElementById("animSlider").innerHTML = output
  animSpeed = output
}

// FUNCTIONS

async function swap(arr, a, b){
  await sleep(200/animSpeed);
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

async function randomize(arr){
  osc.start()
  for(let i = 0; i < arr.length; i++){
    osc.freq(map(arr[i], 0, arr.length, 0, height, true) * oscPitch, 0);
    await swap(arr, i, int(random(0, arr.length)))
  }
  osc.stop()
}

async function bubbleSort(arr){

  let comps = 0, swaps = 0

  statusText2 = "Comparisons: " + comps
  statusText3 = "Swaps: " + swaps
    
  osc.start()
  for(var i = 0; i < arr.length; i++){
    
    // Last i elements are already in place  
    for(var j = 0; j < ( arr.length - i -1 ); j++){
      
      // Checking if the item at present iteration 
      // is greater than the next iteration
      comps++


      if(arr[j] > arr[j+1]){
        arrState[j] = 2
        
        osc.freq(map(arr[j+1], 0, arr.length, 0, height, true) * oscPitch, 0);

        swaps++
        await swap(arr, j, j+1)
        arrState[j] = 0
      }
      statusText2 = "Comparisons: " + comps
      statusText3 = "Swaps: " + swaps
    }

    
    
  }
  osc.stop()
}

async function insertionSort(arr) 
{ 
  let i, key, j; 

  let comps = 0, swaps = 0

  statusText2 = "Comparisons: " + comps
  statusText3 = "Swaps: " + swaps

  osc.start()

  for (i = 1; i < arr.length; i++)
  { 
    key = arr[i]; 
    j = i - 1; 

    /* Move elements of arr[0..i-1], that are 
    greater than key, to one position ahead 
    of their current position */
    //await sleep(500/animSpeed)

    while (j >= 0 && arr[j] > key)
    { 
      arrState[j] = 2
      osc.freq(map(arr[j+1], 0, arr.length, 0, height, true) * oscPitch, 0);
      
      comps++
      swaps++
      
      arr[j + 1] = arr[j]; 
      j = j - 1; 

      await sleep(200/animSpeed)

      arrState[j+1] = 0

      statusText2 = "Comparisons: " + comps
      statusText3 = "Swaps: " + swaps
      
    } 
    swaps++

    arr[j + 1] = key; 
  } 

  osc.stop()
} 

async function selectionSort(arr)
{
  var i, j, min;

  let comps = 0, swaps = 0

  statusText2 = "Comparisons: " + comps
  statusText3 = "Swaps: " + swaps

  osc.start()

  // One by one move boundary of unsorted subarray
  for (i = 0; i < arr.length-1; i++)
  {
    // Find the minimum element in unsorted array
    min = i;
    for (j = i + 1; j <  arr.length; j++){

      arrState[j] = 2
      comps++

      if (arr[j] < arr[min]){
        arrState[min] = 0
        min = j;

        arrState[min] = 3   
        
      }
      osc.freq(map(arr[j], 0, arr.length, 0, height, true) * oscPitch, 0);

      await sleep(200/animSpeed);

      if(arrState[j] != arrState[min]) arrState[j] = 0

      statusText2 = "Comparisons: " + comps
      statusText3 = "Swaps: " + swaps
      
    }
    arrState[min] = 0


    osc.freq(map(arr[min], 0, arr.length, 0, height, true) * oscPitch, 0);
    // Swap the found minimum element with the first element
    swaps++
    await swap(arr,min, i);

    statusText2 = "Comparisons: " + comps
    statusText3 = "Swaps: " + swaps
  }

  osc.stop()
}

//MERGE FOR MERGE SORT
async function merge(arr, l, m, r)
{
  var n1 = m - l + 1;
  var n2 = r - m;

  // Create temp arrays
  var L = new Array(n1);
  var R = new Array(n2);

  // Copy data to temp arrays L[] and R[]
  for (var i = 0; i < n1; i++)
      L[i] = arr[l + i];
  for (var j = 0; j < n2; j++)
      R[j] = arr[m + 1 + j];

  // Merge the temp arrays back into arr[l..r]

  // Initial index of first subarray
  var i = 0;

  // Initial index of second subarray
  var j = 0;

  // Initial index of merged subarray
  var k = l;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
    }
    else {
        arr[k] = R[j];
        j++;
    }
    k++;
    osc.freq(map(arr[k], 0, arr.length, 0, height, true) * oscPitch, 0);
    arrState[k] = 2
    await sleep(200/animSpeed)

    arrState[k] = 0
  }

  // Copy the remaining elements of
  // L[], if there are any
  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }

  // Copy the remaining elements of
  // R[], if there are any
  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}

// l is for left index and r is
// right index of the sub-array
// of arr to be sorted */
async function mergeSort(arr,l, r){
  
  if(l>=r){
      return;//returns recursively
  }
  var m = l + parseInt((r-l)/2);
  await mergeSort(arr,l,m);
  await mergeSort(arr,m+1,r);
  await merge(arr,l,m,r);
  
}

//PARTITION FOR QUICK SORT
async function partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)], //middle element
  i = left, //left pointer
  j = right; //right pointer

  arrState[pivot] = 3

  while (i <= j) {
    while (items[i] < pivot) {

      i++;
      arrState[i] = 2
      await(200/animSpeed)

      arrState[i] = 0
    }
    while (items[j] > pivot) {
      j--;

      arrState[j] = 2
      await(200/animSpeed)

      arrState[j] = 0
    }
    if (i <= j) {

      arrState[j] = 2
      osc.freq(map(arr[j], 0, arr.length, 0, height, true) * oscPitch, 0);


      await swap(items, i, j); //sawpping two elements

      osc.freq(map(arr[j], 0, arr.length, 0, height, true) * oscPitch, 0);
      arrState[j] = 0

      i++;
      j--;
    }
  }

  arrState[pivot] = 0

  return i;
}

async function quickSort(items, left, right) {
  var index;
  if (items.length > 1) {
    index = await partition(items, left, right); //index returned from partition
    if (left < index - 1) { //more elements on the left side of the pivot
      await quickSort(items, left, index - 1);
    }
    if (index < right) { //more elements on the right side of the pivot
      await quickSort(items, index, right);
    }
  }
  return items;
}

async function cocktailSort(arr) {
  let swapped = true;
  let start = 0;
  let end = arr.length;

  while (swapped == true) {

    // reset the swapped flag on entering the
    // loop, because it might be true from a
    // previous iteration.
    swapped = false;

    // loop from bottom to top same as
    // the bubble sort
    for (let i = start; i < end - 1; ++i) {
      if (arr[i] > arr[i + 1]) {
        // let temp = arr[i];
        // arr[i] = arr[i + 1];
        // arr[i + 1] = temp;
        arrState[i] = 2

        await swap(arr, i, i+1)
        osc.freq(map(arr[i], 0, arr.length, 0, height, true) * oscPitch, 0);

        arrState[i] = 0

        swapped = true;
      }
    }

    // if nothing moved, then array is sorted.
    if (swapped == false)
      break;

    // otherwise, reset the swapped flag so that it
    // can be used in the next stage
    swapped = false;

    // move the end point back by one, because
    // item at the end is in its rightful spot
    end = end - 1;

    // from top to bottom, doing the
    // same comparison as in the previous stage
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        // let temp = arr[i];
        // arr[i] = arr[i + 1];
        // arr[i + 1] = temp;
        arrState[i+1] = 2

        await swap(arr, i, i+1)
        osc.freq(map(arr[i+1], 0, arr.length, 0, height, true) * oscPitch, 0);

        arrState[i+1] = 0

        swapped = true;
      }
    }

    // increase the starting point, because
    // the last stage would have moved the next
    // smallest number to its rightful spot.
    start = start + 1;
  }
}

//COMBSORT UTIL -> To find gap between elements
async function getNextGap(gap)
{
    // Shrink gap by Shrink factor
    gap = parseInt((gap*10)/13, 10);
    if (gap < 1)
        return 1;
    return gap;
}

async function combSort(arr) {
  let n = arr.length;

  // initialize gap
  let gap = n;

  // Initialize swapped as true to
  // make sure that loop runs
  let swapped = true;

  // Keep running while gap is more than
  // 1 and last iteration caused a swap
  while (gap != 1 || swapped == true)
  {
    // Find next gap
    gap = await getNextGap(gap);

    // Initialize swapped as false so that we can
    // check if swap happened or not
    swapped = false;

    // Compare all elements with current gap
    for (let i=0; i<n-gap; i++)
    {
      arrState[i] = 2

      osc.freq(map(arr[i+gap], 0, arr.length, 0, height, true) * oscPitch, 0);

      if (arr[i] > arr[i+gap])
      {
        // Swap arr[i] and arr[i+gap]
        // let temp = arr[i];
        // arr[i] = arr[i+gap];
        // arr[i+gap] = temp;
        arrState[i+gap] = 3
        
        await swap(arr, i, i+gap)

        arrState[i+gap] = 0
        

        // Set swapped
        swapped = true;
      }
      else{ //SOLELY FOR VISUALIZER
        await sleep(200/animSpeed)
      }

      arrState[i] = 0
    }
  }
}

async function heapSort(arr) {
  var n = arr.length;

  // Build heap (rearrange array)
  for (var i = Math.floor(n / 2) - 1; i >= 0; i--)
  await heapify(arr, n, i);

  // One by one extract an element from heap
  for (var i = n - 1; i > 0; i--) {
    // Move current root to end
    // var temp = arr[0];
    // arr[0] = arr[i];
    // arr[i] = temp;
    arrState[i] = 2
    await swap(arr, 0, i)

    osc.freq(map(arr[i], 0, arr.length, 0, height, true) * oscPitch, 0);
    arrState[i] = 0
    // call max heapify on the reduced heap
    await heapify(arr, i, 0);
  }
}
 
// To heapify a subtree rooted with node i which is
// an index in arr[]. n is size of heap
async function heapify(arr, n, i) {
  var largest = i; // Initialize largest as root
  var l = 2 * i + 1; // left = 2*i + 1
  var r = 2 * i + 2; // right = 2*i + 2

  // If left child is larger than root
  if (l < n && arr[l] > arr[largest])
    largest = l;

  // If right child is larger than largest so far
  if (r < n && arr[r] > arr[largest])
    largest = r;

  // If largest is not root
  if (largest != i) {
    // var swap = arr[i];
    // arr[i] = arr[largest];
    // arr[largest] = swap;
    arrState[largest] = 2
    await swap(arr, i, largest)

    osc.freq(map(arr[i], 0, arr.length, 0, height, true) * oscPitch, 0);
    arrState[largest] = 0

    // Recursively heapify the affected sub-tree
    await heapify(arr, n, largest);
  }
}

async function gnomeSort(arr) {
  let index = 0;

  while (index < arr.length) {
    if (index == 0)
      index++;
    if (arr[index] >= arr[index - 1])
      index++;
    else {
      let temp = 0;

      arrState[index] = 2

      await sleep(200/animSpeed)
      temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;

      osc.freq(map(arr[index], 0, arr.length, 0, height, true) * oscPitch, 0);
      
      arrState[index] = 0

      index--;
    }
  }
}

async function shellSort(arr) {
  var increment = arr.length / 2;
  while (increment > 0) {
    for (i = increment; i < arr.length; i++) {
      var j = i;
      var temp = arr[i];

      while (j >= increment && arr[j-increment] > temp) {
        arr[j] = arr[j-increment];
        j = j - increment;

        arrState[j] = 2

        await sleep(200/animSpeed)

        osc.freq(map(arr[j], 0, arr.length, 0, height, true) * oscPitch, 0);

        arrState[j] = 0

      }

      arr[j] = temp;
    }

    if (increment == 2) {
      increment = 1;
    } 
    else {
      increment = parseInt(increment*5 / 11);
    }
  }

}

async function insertionSortSingle(arr,left,right)
{
  for(let i = left + 1; i <= right; i++)
  {
    let temp = arr[i];
    let j = i - 1;
      
    while (j >= left && arr[j] > temp)
    {
      arr[j + 1] = arr[j];
      j--;
      
    }
    arr[j + 1] = temp;

    arrState[j+1] = 2
    await sleep(200/animSpeed)

    arrState[j+1] = 0
    osc.freq(map(arr[j+1], 0, arr.length, 0, height, true) * oscPitch, 0);
      
  }
}

let MIN_MERGE = 32;
 
async function minRunLength(n)
{
     
    // Becomes 1 if any 1 bits are shifted off
  let r = 0;
  while (n >= MIN_MERGE)
  {
    r |= (n & 1);
    n >>= 1;
  }
  return n + r;
}

async function timSort(arr, n) {
  let minRun = await minRunLength(MIN_MERGE);
      
  // Sort individual subarrays of size RUN
  for(let i = 0; i < n; i += minRun)
  {
    await insertionSortSingle(arr, i, Math.min((i + MIN_MERGE - 1), (n - 1)));
  }

  // Start merging from size
  // RUN (or 32). It will
  // merge to form size 64,
  // then 128, 256 and so on
  // ....
  for(let size = minRun; size < n; size = 2 * size)
  {
        
    // Pick starting point
    // of left sub array. We
    // are going to merge
    // arr[left..left+size-1]
    // and arr[left+size, left+2*size-1]
    // After every merge, we
    // increase left by 2*size
    for(let left = 0; left < n; left += 2 * size) {

      // Find ending point of left sub array
      // mid+1 is starting point of right sub
      // array
      let mid = left + size - 1;
      let right = Math.min((left + 2 * size - 1),(n - 1));

      // Merge sub array arr[left.....mid] &
      // arr[mid+1....right]
      if(mid < right) await merge(arr, left, mid, right);
    }
  }
}


async function sortComplete(arr) {
  osc.start()
  for(var i = 0; i < arr.length; i++){
    arrState[i] = 1
    osc.freq(map(arr[i], 0, arr.length, 0, height, true) * oscPitch, 0);
    await sleep(200/animSpeed);
  }
  
  osc.stop()
}

async function resetArrStates(arr) {
  statusText2 = ""
  statusText3 = ""
  for(var i = 0; i < arr.length; i++){
    arrState[i] = 0
    osc.freq(map(arr[i], 0, arr.length, 0, height, true) * oscPitch, 0);
  }
} 

// BUTTON FUNCTIONS

async function handleShuffle() {
  resetArrStates(arr)
  statusText = "Shuffling"
  await randomize(arr)

  statusText = "Standby"
}

async function handleBubbleSort() {
  resetArrStates(arr)

  statusText = "Running: Bubble Sort"
  disableButtonControls()

  await bubbleSort(arr)

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleInsertionSort() {
  resetArrStates(arr)

  statusText = "Running: Insertion Sort"
  disableButtonControls()

  await insertionSort(arr)

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleSelectionSort() {
  resetArrStates(arr)

  statusText = "Running: Selection Sort"
  disableButtonControls()

  await selectionSort(arr)

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleMergeSort() {
  resetArrStates(arr)

  statusText = "Running: Merge Sort"
  disableButtonControls()

  osc.start()
  await mergeSort(arr, 0, arr.length - 1)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleQuickSort() {
  resetArrStates(arr)
  statusText = "Running: Quick Sort"
  disableButtonControls()

  osc.start()
  await quickSort(arr, 0, arr.length - 1)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleCocktailSort() {
  resetArrStates(arr)
  statusText = "Running: Cocktail Sort"
  disableButtonControls()

  osc.start()
  await cocktailSort(arr)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleCombSort() {
  resetArrStates(arr)
  statusText = "Running: Comb Sort"
  disableButtonControls()

  osc.start()
  await combSort(arr)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleHeapSort() {
  resetArrStates(arr)
  statusText = "Running: Heap Sort"
  disableButtonControls()

  osc.start()
  await heapSort(arr)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleGnomeSort() {
  resetArrStates(arr)
  console.log("HERE")
  statusText = "Running: Gnome Sort"
  disableButtonControls()

  osc.start()
  await gnomeSort(arr)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleShellSort() {
  resetArrStates(arr)
  statusText = "Running: Shell Sort"
  disableButtonControls()

  osc.start()
  await shellSort(arr)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

async function handleTimSort() {
  resetArrStates(arr)
  statusText = "Running: Tim Sort"
  disableButtonControls()

  osc.start()
  await timSort(arr, arr.length)
  osc.stop()

  await sortComplete(arr)

  statusText = "Standby"
  enableButtonControls()
}

let arr = [], arrState = []
let arraySize = 30
let osc

let sortWidth, sortHeight
let sortOffsetX, sortOffsetY

var statusText = "Standby"
var statusText2 = ""
var statusText3 = ""

function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");

  rectMode(CORNER)
  textAlign(CENTER, CENTER)

  handleAdj()

  osc = new p5.Oscillator('triangle');
  pixelDensity(1);

}

function draw() {
  background(28, 42, 53);

  noStroke()
  fill(255,255,255)
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)
  text(statusText2, 10, 30)
  text(statusText3, 10, 50)


  stroke(28, 42, 53)

  noStroke()
  size = sortWidth/arr.length
  for(let i = 0; i < arr.length; i++){
    
    //ARRSTATES, 0 -> base; WHITE, 1 -> sorted; GREEN, 2-> selected; RED, 3-> minimum BLUE;

    if(arrState[i] == 1){
      fill(0,255,30)
    }
    else if(arrState[i] == 2){
      fill(255, 0, 0)
    }
    else if(arrState[i] == 3){
      fill(229, 255, 0)
    }
    else{
      fill(255,255,255)
    }
    
    rect(sortOffsetX/2 + size * i, sortOffsetY/2 + sortHeight - map(arr[i], 0, arr.length, 0, sortHeight, true), 
    size, map(arr[i], 0, arr.length, 0, sortHeight, true))
  }
  
}

async function mousePressed() {
}

function windowResized() {
  var controlsHeight = document.getElementById("controlMain").offsetHeight 
  resizeCanvas(windowWidth, windowHeight - controlsHeight);
  pixelDensity(1);

  sortOffsetX = 100
  sortOffsetY = 100

  sortWidth = width - sortOffsetX/2
  sortHeight = height - sortOffsetY/2
}


