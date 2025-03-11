import { sleep, group, check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 2,
  duration: '10m',
};

const BASE_URL = 'https://petstore.octoperf.com';
const HEADERS = {
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35 Safari/537.36',
  'sec-ch-ua': '"Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
};


const FAKE_CREDET_CARD = '999 9999 9999 9999';
const ORDER_EXPIRY_DATE = '12/03';
const ITEM_ID = "EST-1";
const ITEM_QUANTITY = "10";
const csvData = open('./Test_Data.csv');


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


function parseCSV(csvData) {
  const rows = csvData.split('\n');
  const headers = rows[0].split(',');
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');
    if (row.length === headers.length) {
      const rowData = {};
      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j].trim()] = row[j].trim();
      }
      data.push(rowData);
    }
  }

  return data;
}


let currentRowIndex = 0;
let parsedData;

export function setup() {
  parsedData = parseCSV(csvData);
  console.log('CSV data parsed successfully');
  return parsedData;
}


export default function (data) {
  const row = data[currentRowIndex];

  const USER_DATA = {
    username: generateRandomString(10),
    password: row.password,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address1: row.address1,
    address2: row.address2,
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
    languagePreference: 'english',
    favouriteCategoryId: 'FISH',
  };
  currentRowIndex = (currentRowIndex + 1) % data.length;

  let response;


  group('page_1 - Homepage', function () {
    response = http.get(`${BASE_URL}/actions/Catalog.action`, {
      headers: {
        ...HEADERS,
      },
    });
    check(response, {
      'catalog map picture loaded': (r) => r.status === 200 && r.body.includes('<map name="estoremap">'),
    });
  });

  group('page_2 - Signon Form', function () {
    response = http.get(`${BASE_URL}/actions/Account.action?signonForm=`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Catalog.action`,
      },
    });

    check(response, {
      'Contains register now link': (r) => r.status === 200 && r.body.includes('Register Now!'),
    });
  });

  group('page_3 - Register Form', function () {
    response = http.get(`${BASE_URL}/actions/Account.action?newAccountForm=`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Account.action?signonForm=`,
      },
    });

    check(response, {
      'newAccount form loaded and contains save account btn':
        (r) => r.status === 200 && r.body.includes('Save Account Information'),
    });
  });

  group('page_4 - Register Account', function () {

    sleep((Math.random() * 5) + 0.5);

    response = http.post(
      `${BASE_URL}/actions/Account.action`,
      {
        username: USER_DATA.username,
        password: USER_DATA.password,
        repeatedPassword: USER_DATA.password,
        'account.firstName': USER_DATA.firstName,
        'account.lastName': USER_DATA.lastName,
        'account.email': USER_DATA.email,
        'account.phone': USER_DATA.phone,
        'account.address1': USER_DATA.address1,
        'account.address2': USER_DATA.address2,
        'account.city': USER_DATA.city,
        'account.state': USER_DATA.state,
        'account.zip': USER_DATA.zip,
        'account.country': USER_DATA.country,
        'account.languagePreference': USER_DATA.languagePreference,
        'account.favouriteCategoryId': USER_DATA.favouriteCategoryId,
        newAccount: 'Save Account Information',
        _sourcePage: 'F7rNBgH4u_CvrVBBXm9FCi3uyWcoFS-vI585oBNZWfVwo8fxZb86SKJHFVehK4ckUeKvH8c896Fl0KheK2aGIFyHSrUp6Yjh2XZdkVEZeZE=',
        __fp: '0NHg4NDG3fCe7zOJJf2QFYdIPGdDrVJjn_bDFnN2SECjz5SSIGszTlv6T3Z79UwDXKSyfN2VSDjQZ-CeePc1f2uJaNO8yOUUm8_uXhUQgFeMfju-T0YqXsj2kmMHwbOI-43PY3AqAiqlmEgsc3H-y8oVXeNK41qjIGqoBT31H5FrRtL4wHIYpLtwaOuQjtNu',
      },
      {
        headers: {
          ...HEADERS,
          'content-type': 'application/x-www-form-urlencoded',
          origin: BASE_URL,
          referer: `${BASE_URL}/actions/Account.action?newAccountForm=`,
        },
      }
    );
    check(response, {
      'account registered and redircted to Hompage':
        (r) => r.status === 200 && r.body.includes('<map name="estoremap">'),
    });
  });

  group('page_5 - Fish Catalogue', function () {
    response = http.get(`${BASE_URL}/actions/Catalog.action?viewCategory=&categoryId=FISH`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Catalog.action`,
      },
    });

    check(response, {
      'Fish" in h2 tag': (r) => r.status === 200 && r.body.includes('<h2>Fish</h2>'),
    });
  });

  group('page_6 - Angelfish', function () {
    response = http.get(`${BASE_URL}/actions/Catalog.action?viewProduct=&productId=FI-SW-01`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Catalog.action?viewCategory=&categoryId=FISH`,
      },
    });

    check(response, {
      'Angelfish in h2 tag': (r) => r.status === 200 && r.body.includes('<h2>Angelfish</h2>'),
    });
  });

  group('page_7 - Large Angelfish', function () {
    response = http.get(`${BASE_URL}/actions/Catalog.action?viewItem=&itemId=${ITEM_ID}`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Catalog.action?viewProduct=&productId=FI-SW-01`,
      },
    });

    check(response, {
      'Item ID is in bold': (r) => r.status === 200 && r.body.includes(`<b> ${ITEM_ID} </b>`),
    });
  });

  group('page_8 - Shopping Cart', function () {
    response = http.get(`${BASE_URL}/actions/Cart.action?addItemToCart=&workingItemId=EST-1`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Catalog.action?viewItem=&itemId=${ITEM_ID}`,
      },
    });

    check(response, {
      'Shopping Cart in h2 tag': (r) => r.status === 200 && r.body.includes('<h2>Shopping Cart</h2>'),
    });
  });

  group('page_9 - Add Fish Quantity', function () {
    response = http.post(
      `${BASE_URL}/actions/Cart.action`, {
      'EST-1': '10',
      'updateCartQuantities': 'Update Cart',
      '_sourcePage': '3n6wRXdsGVvrtxu8tk5V6sSM3ERiXrHgbxORTCoNoolo6RMTStlYxNc0l1kuSxb9Dh0mVbVX35A9ZvIsUbVUKd49BylqBZcy',
      '__fp': 'l_vzMVF1MFwgqlzc2eMRTKdI8OtIdlz-8psHwzBk37g17CiAQSAfwxyNOz4M9nC3',
    }, {
      headers: {
        ...HEADERS,
        'content-type': 'application/x-www-form-urlencoded',
        origin: BASE_URL,
        referer: `${BASE_URL}/actions/Cart.action?addItemToCart=&workingItemId=EST-1`,
      },
    });

    check(response, {
      'Fish quantity updated': (r) => r.status === 200 && r.body.includes
        (`<input size="3" name="${ITEM_ID}" type="text" value="${ITEM_QUANTITY}" />`),
    })
  });

  group('page_10 - Order Form', function () {
    response = http.get(`${BASE_URL}/actions/Order.action?newOrderForm=`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Cart.action?addItemToCart=&workingItemId=EST-1`,
      },
    });

    check(response, {
      'Payment Details loaded': (r) => r.status === 200 && r.body.includes('<th colspan=2>Payment Details</th>'),
    });
  });

  group('page_11 - Place Order', function () {

    sleep(0.5);

    response = http.post(
      `${BASE_URL}/actions/Order.action`,
      {
        'order.cardType': 'Visa',
        'order.creditCard': FAKE_CREDET_CARD,
        'order.expiryDate': ORDER_EXPIRY_DATE,
        'order.billToFirstName': USER_DATA.firstName,
        'order.billToLastName': USER_DATA.lastName,
        'order.billAddress1': USER_DATA.address1,
        'order.billAddress2': USER_DATA.address2,
        'order.billCity': USER_DATA.city,
        'order.billState': USER_DATA.state,
        'order.billZip': USER_DATA.zip,
        'order.billCountry': USER_DATA.country,
        newOrder: 'Continue',
        _sourcePage: 'K2ynVa-zJYyU2ftn45Yn2DqQD5X09ob4i-oGDAlMyaKDQo9NziPdv0qEuEThlvhDnI2xX-tWdhM_4UXNpfM5pOPFPfs1POz5ePEWTwJ5PvY=',
        __fp: 'bpkG0XMsiKIjdoq-krDEXu6J8P7dvEQ5GTnkNok6vLxjH572m1yo03ph3QT2ewfOawhHK2BcKmlERJtfZW1Z5WamGL9Ok1GI2zayp9jfo4TWgWIZHgs3nQ==',
      },
      {
        headers: {
          ...HEADERS,
          'content-type': 'application/x-www-form-urlencoded',
          origin: BASE_URL,
          referer: `${BASE_URL}/actions/Order.action?newOrderForm=`,
        },
      }
    );

    check(response, {
      'order placed': (r) => r.status === 200 && r.body.includes('Please confirm the information below'),
    });
  });

  group('page_12 - Confirm Order', function () {
    response = http.get(`${BASE_URL}/actions/Order.action?newOrder=&confirmed=true`, {
      headers: {
        ...HEADERS,
        referer: `${BASE_URL}/actions/Order.action`,
      },
    });
    check(response, {
      'order confirmed': (r) => r.status === 200 && r.body.includes('Thank you, your order has been submitted'),
    });
  });

  sleep(0.3);
}
