"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectrumUserModel = void 0;
class SpectrumUserModel {
    constructor(data) {
        this.companyCode = `${data['Company_Code']}`;
        this.firstName = `${data['First_Name']}`;
        this.middleName = `${data['Middle_Name']}`;
        this.lastName = `${data['Last_Name']}`;
        this.employeeCode = `${data['Employee_Code']}`;
        this.costCenter = `${data['Cost_Center']}`;
        this.employeeStatus = `${data['Employment_Status']}`;
        this.departementCode = `${data['Department_Code']}`;
        this.unionCode = `${data['Union_Code']}`;
        this.title = `${data['Title']}`;
        this.employeeMobilePhone = `${data['Employee_Mobile_Phone']}`;
    }
}
exports.SpectrumUserModel = SpectrumUserModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tdXNlci1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NwZWN0cnVtLWludGVncmF0aW9uL2Z1bmN0aW9uL21vZGVsL3NwZWN0cnVtLXVzZXItbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxpQkFBaUI7SUFjMUIsWUFBWSxJQUFTO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUE7UUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFBO1FBQzFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQTtRQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFBO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFBO1FBQ3BELElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQTtJQUNqRSxDQUFDO0NBQ0o7QUEzQkQsOENBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNwZWN0cnVtVXNlck1vZGVsIHtcbiAgICBjb21wYW55Q29kZTogc3RyaW5nO1xuICAgIGZpcnN0TmFtZTogc3RyaW5nO1xuICAgIG1pZGRsZU5hbWU6IHN0cmluZztcbiAgICBsYXN0TmFtZTogc3RyaW5nO1xuICAgIGVtcGxveWVlQ29kZTogc3RyaW5nO1xuICAgIGNvc3RDZW50ZXI6IHN0cmluZztcbiAgICBlbXBsb3llZVN0YXR1czogc3RyaW5nO1xuICAgIGRlcGFydGVtZW50Q29kZTogc3RyaW5nO1xuICAgIHVuaW9uQ29kZTogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgZW1wbG95ZWVNb2JpbGVQaG9uZTogc3RyaW5nO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5jb21wYW55Q29kZSA9IGAke2RhdGFbJ0NvbXBhbnlfQ29kZSddfWBcbiAgICAgICAgdGhpcy5maXJzdE5hbWUgPSBgJHtkYXRhWydGaXJzdF9OYW1lJ119YFxuICAgICAgICB0aGlzLm1pZGRsZU5hbWUgPSBgJHtkYXRhWydNaWRkbGVfTmFtZSddfWBcbiAgICAgICAgdGhpcy5sYXN0TmFtZSA9IGAke2RhdGFbJ0xhc3RfTmFtZSddfWBcbiAgICAgICAgdGhpcy5lbXBsb3llZUNvZGUgPSBgJHtkYXRhWydFbXBsb3llZV9Db2RlJ119YFxuICAgICAgICB0aGlzLmNvc3RDZW50ZXIgPSBgJHtkYXRhWydDb3N0X0NlbnRlciddfWBcbiAgICAgICAgdGhpcy5lbXBsb3llZVN0YXR1cyA9IGAke2RhdGFbJ0VtcGxveW1lbnRfU3RhdHVzJ119YFxuICAgICAgICB0aGlzLmRlcGFydGVtZW50Q29kZSA9IGAke2RhdGFbJ0RlcGFydG1lbnRfQ29kZSddfWBcbiAgICAgICAgdGhpcy51bmlvbkNvZGUgPSBgJHtkYXRhWydVbmlvbl9Db2RlJ119YFxuICAgICAgICB0aGlzLnRpdGxlID0gYCR7ZGF0YVsnVGl0bGUnXX1gXG4gICAgICAgIHRoaXMuZW1wbG95ZWVNb2JpbGVQaG9uZSA9IGAke2RhdGFbJ0VtcGxveWVlX01vYmlsZV9QaG9uZSddfWBcbiAgICB9XG59Il19