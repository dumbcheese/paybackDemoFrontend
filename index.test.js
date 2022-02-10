/**
 * @jest-environment jsdom
 */

const { TestWatcher } = require("jest");
const { fetchBackendData, fetchPaybackData } = require("./index.js");
require ('@testing-library/jest-dom');
require ('jest-fetch-mock');


//sanity check
test("Should be null", () => {
  expect(null).toBeNull();
});

test('Backend fetch should return BMW', () => {
  const input = { value: "bmw"};
    expect(fetchBackendData(input)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({make: "bmw"})
      ])
    )
});

test('Payback fetch should return REWE', () => {
  const input = { value: "rew"};
    expect(fetchPaybackData(input)).resolves.toEqual(
      expect.objectContaining([
        expect.objectContaining([
          expect.objectContaining({title: "REWE Onlineshop"})
        ])
      ])
    )
});

