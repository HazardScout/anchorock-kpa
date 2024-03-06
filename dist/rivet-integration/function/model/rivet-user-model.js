"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RivetUserModel = void 0;
class RivetUserModel {
    constructor(data) {
        this.id = data['id'];
        this.employeeId = data['employeeid'];
        this.email = data['email'];
        this.firstName = data['firstname'];
        this.lastName = data['lastname'];
        this.phoneNumber = data['mobilenumber'];
        this.city = data['city'];
        this.state = data['state'];
        this.zip = data['zip'];
        this.address = data['address'];
        this.hireDate = data['hiredate'];
        this.terminationDate = data['terminationdate'];
    }
}
exports.RivetUserModel = RivetUserModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtdXNlci1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3JpdmV0LWludGVncmF0aW9uL2Z1bmN0aW9uL21vZGVsL3JpdmV0LXVzZXItbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxjQUFjO0lBY3ZCLFlBQVksSUFBUztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQTVCRCx3Q0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUml2ZXRVc2VyTW9kZWwge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgZW1wbG95ZWVJZDogc3RyaW5nO1xuICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgZmlyc3ROYW1lOiBzdHJpbmc7XG4gICAgbGFzdE5hbWU6IHN0cmluZztcbiAgICBwaG9uZU51bWJlcjogc3RyaW5nO1xuICAgIGNpdHk6IHN0cmluZztcbiAgICBzdGF0ZTogc3RyaW5nO1xuICAgIHppcDogc3RyaW5nO1xuICAgIGFkZHJlc3M6IHN0cmluZztcbiAgICBoaXJlRGF0ZTogc3RyaW5nO1xuICAgIHRlcm1pbmF0aW9uRGF0ZTogc3RyaW5nO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGRhdGE6IGFueSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YVsnaWQnXTtcbiAgICAgICAgdGhpcy5lbXBsb3llZUlkID0gZGF0YVsnZW1wbG95ZWVpZCddO1xuICAgICAgICB0aGlzLmVtYWlsID0gZGF0YVsnZW1haWwnXTtcbiAgICAgICAgdGhpcy5maXJzdE5hbWUgPSBkYXRhWydmaXJzdG5hbWUnXTtcbiAgICAgICAgdGhpcy5sYXN0TmFtZSA9IGRhdGFbJ2xhc3RuYW1lJ107XG4gICAgICAgIHRoaXMucGhvbmVOdW1iZXIgPSBkYXRhWydtb2JpbGVudW1iZXInXTtcbiAgICAgICAgdGhpcy5jaXR5ID0gZGF0YVsnY2l0eSddO1xuICAgICAgICB0aGlzLnN0YXRlID0gZGF0YVsnc3RhdGUnXTtcbiAgICAgICAgdGhpcy56aXAgPSBkYXRhWyd6aXAnXTtcbiAgICAgICAgdGhpcy5hZGRyZXNzID0gZGF0YVsnYWRkcmVzcyddO1xuICAgICAgICB0aGlzLmhpcmVEYXRlID0gZGF0YVsnaGlyZWRhdGUnXTtcbiAgICAgICAgdGhpcy50ZXJtaW5hdGlvbkRhdGUgPSBkYXRhWyd0ZXJtaW5hdGlvbmRhdGUnXTtcbiAgICB9XG59Il19