'use strict';


const STORE = { // changed store to an object 
  items: [
    { name: 'apples', checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'bread', checked: false }
  ],
  filter: false, // added checktoggle functionality
  search: '', //added search
};

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit" 
          <span class"button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join(''); //linting
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let items = STORE.items;
  //creates a items variable that will only render unchecked items if STORE.filter is toggled
  if (STORE.filter) {
    items = STORE.items.filter(item => !item.checked);
  }
  if (STORE.search) {
    items = STORE.items.filter(item => item.name.includes(STORE.search));
  }
  const shoppingListItemsString = generateShoppingItemsString(items); // changes paramater to items 

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, edit: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
  //refrence STORE as an object now
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  console.log('delete check for item');
  STORE.items.splice(itemIndex, 1);
  // store as an object
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleItemCheckDelete` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}

function showChecked() {
  console.log('toggle checked');
  STORE.filter = !STORE.filter;
}
//toggles filter
//function below listens for click and invokes the filter and renders the page again 

function handleCheckBoxToggle() {  
  $('.checkbox').click(event => {
    console.log('checkBoxToggle ran');
    showChecked(STORE);
    renderShoppingList();
  });
}

// very similar to addItemToShoppingList(newItemName); & handlecheckbox
// listens for input and assigns the user input to searchItem then renders only the items that match the name property within store

function search(input) {
  console.log('search toggle');
  STORE.search = input;
}

function handleSearchBar() {
  $('#shopping-list-search').click(event => {
    event.preventDefault();
    console.log('search bar clicked');
    let searchItem = $('.search-entry').val();
    $('.search-entry').val('');
    console.log(searchItem);
    search(searchItem);
    renderShoppingList();
    
  });
  
}

function toggleEditItem(itemIndex) {
  //console.log('Toggling edit name property for item at index ' + itemIndex);
  STORE.edit = !STORE.edit; //might be pointless
}

function handleItemEdit() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    console.log('`handleItemEdit` ran');
    let edit = prompt('Edit item');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    let newItem = STORE.items[itemIndex];
    console.log(newItem);
    newItem.name = edit;
    toggleEditItem(itemIndex);
    renderShoppingList(newItem);
  });
}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckBoxToggle();
  handleSearchBar();
  handleItemEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);