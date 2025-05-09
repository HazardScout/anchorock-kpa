import { KPAProjectAPI } from './kpa-project-api';
import axios from "axios";
import {
  describe,
  it,
  expect,
} from '@jest/globals';

require('dotenv').config();
// Mock jest and set the type
jest.mock('axios');

describe('kpa-api-project-list-test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  let responseData = {
    "projects": [
      {
        "id": 12,
        "created": "1744659880548",
        "updated": "1744659880548",
        "deleted": false,
        "name": "Windrock Construction Comp.",
        "number": "389532",
        "address": "5656 Winding Rd.",
        "city": "Cincinnati",
        "state": "OH",
        "zip": "45251",
        "active": true,
        "notes": null,
        "attachments": []
      },
      {
        "id": 11,
        "created": "1744659880548",
        "updated": "1744659880548",
        "deleted": false,
        "name": "Samsung Test Lab 2",
        "number": "38199",
        "address": "250 Americana Way",
        "city": "Glendale",
        "state": "CA",
        "zip": "91210",
        "active": false,
        "notes": null,
        "attachments": []
      }],
      "paging": {
          "total": 4,
          "last_page": 2
      },
      "ok": true
  };

  let responseDataPage2 = {
    "projects": [
      {
        "id": 2,
        "created": "1744659880547",
        "updated": "1744659880547",
        "deleted": false,
        "name": "Apple T14",
        "number": "28192",
        "address": "10600 N Tantau Ave",
        "city": "Cupertino",
        "state": "CA",
        "zip": "95014",
        "active": true,
        "notes": null,
        "attachments": []
      },
      {
        "id": 1,
        "created": "1744659880547",
        "updated": "1744659880547",
        "deleted": false,
        "name": "Airlift Pump Station 38",
        "number": "29101",
        "address": "33 South First St",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105",
        "active": true,
        "notes": null,
        "attachments": []
      }],
      "paging": {
          "total": 4,
          "last_page": 2
      },
      "ok": true
  };
  // post axios mock for project.list
  const mockPost = jest.fn().mockImplementation((url, body) => {
    switch (body.page) {
      case 1:
        return Promise.resolve({data: responseData})
      case 2:
        return Promise.resolve({data: responseDataPage2})
      default:
        return Promise.resolve({data: responseData})
    }
  });
  // create axios mock
  (axios.create as jest.Mock).mockReturnValue({ post: mockPost });
  const kpaToken = 'empty token';

  // tests
  describe('kpaApi', () => {

    it('kpa-project-list-with-multi-pages', async () => {

      let kpaProjectAPI = new KPAProjectAPI(kpaToken);
      let kpaExistProjects = await kpaProjectAPI.getAllProject();
      // assert
      expect(axios.create).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledTimes(2);
      expect(mockPost).toHaveBeenCalledWith('projects.list', {"limit": 500, "page": 1, "token": kpaToken});
      expect(kpaExistProjects).toBeInstanceOf(Array);
      expect(kpaExistProjects).toHaveLength(4);

      // assert for number and code
      expect(kpaExistProjects[0].number).not.toBeNull();
      expect(kpaExistProjects[0].number).toBe("389532");
      expect(kpaExistProjects[0].code).toBeDefined();
      expect(kpaExistProjects[0].code).toBe("");

      // assert active
      expect(kpaExistProjects[0].active).toBeTruthy();
      expect(kpaExistProjects[1].active).toBeFalsy();

      // assert isActive is always true (used by integration)
      expect(kpaExistProjects[0].isActive).toBeTruthy();
      expect(kpaExistProjects[1].isActive).toBeTruthy();

      // test second page
      expect(kpaExistProjects[2].id).toBe(2);
      expect(kpaExistProjects[3].id).toBe(1);
    }, 300000);

  })
})
