"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcoreAuthModel = void 0;
class ProcoreAuthModel {
    constructor(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.clientId = `${process.env.PROCORE_CLIENT_ID}`;
        this.clientSecret = `${process.env.PROCORE_CLIENT_SECRET}`;
    }
}
exports.ProcoreAuthModel = ProcoreAuthModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1hdXRoLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvY29yZS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9tb2RlbC9wcm9jb3JlLWF1dGgtbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxnQkFBZ0I7SUFNekIsWUFBWSxXQUFtQixFQUFFLFlBQW9CO1FBQ2pELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBRWpDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUFiRCw0Q0FhQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBQcm9jb3JlQXV0aE1vZGVsIHtcbiAgICBhY2Nlc3NUb2tlbjogc3RyaW5nO1xuICAgIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIGNsaWVudElkOiBzdHJpbmc7XG4gICAgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihhY2Nlc3NUb2tlbjogc3RyaW5nLCByZWZyZXNoVG9rZW46IHN0cmluZykge1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gYWNjZXNzVG9rZW47XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gcmVmcmVzaFRva2VuO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9IGAke3Byb2Nlc3MuZW52LlBST0NPUkVfQ0xJRU5UX0lEfWA7XG4gICAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gYCR7cHJvY2Vzcy5lbnYuUFJPQ09SRV9DTElFTlRfU0VDUkVUfWA7XG4gICAgfVxufSJdfQ==