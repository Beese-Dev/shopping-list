'Use Strict';

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBTN = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBTN = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

// Add Item + local storage. Create Button, and Icon
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (newItem === '') {
    alert('Please add an Item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists');
      return;
    }
  }
  // Create Item Dom Element
  addItemToDOM(newItem);
  // Add Item To local storage
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create list Item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // add new item to list array
  itemsFromStorage.push(item);
  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}
// END Add Item, create Button, and Icon

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBTN.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBTN.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}
// Remove Item
function removeItem(item) {
  if (confirm('Are you sure you want to delete item')) {
    // Remove item from DOM
    item.remove();
    // Remove item from Storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
// END Remove Item

// Clear Items using Clear all button
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // clear from local storage
  localStorage.removeItem('items');
  checkUI();
}
//End Clear Items
// Start Filter Items
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}
// End Filter Items

function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  console.log(items);
  if (items.length == 0) {
    clearBTN.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBTN.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBTN.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBTN.style.backgroundColor = '#333';
  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBTN.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

//
init();
