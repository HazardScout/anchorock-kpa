"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerStatus = void 0;
class WorkerStatus {
    constructor(workerName) {
        this.workerName = workerName;
        this.jobLog = [];
    }
    start() {
        this.started = Date.now();
    }
    done() {
        if (this.stopped) {
            return;
        }
        this.stopped = Date.now();
        this.duration = this.stopped - this.started;
    }
}
exports.WorkerStatus = WorkerStatus;
exports.default = WorkerStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLXN0YXR1cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL3dvcmtlci93b3JrZXItc3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsWUFBWTtJQVFyQixZQUFZLFVBQWlCO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQzlDLENBQUM7Q0FDSjtBQXpCRCxvQ0F5QkM7QUFFRCxrQkFBZSxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vam9iXCI7XG5cbmV4cG9ydCBjbGFzcyBXb3JrZXJTdGF0dXMge1xuICAgIHdvcmtlck5hbWU6c3RyaW5nO1xuICAgIGR1cmF0aW9uOm51bWJlcjtcbiAgICBwcml2YXRlIHN0YXJ0ZWQ6bnVtYmVyO1xuICAgIHByaXZhdGUgc3RvcHBlZDpudW1iZXI7XG4gICAgam9iTG9nOkpvYlN0YXR1c1tdO1xuICAgIGVycm9yOnN0cmluZztcbiAgXG4gICAgY29uc3RydWN0b3Iod29ya2VyTmFtZTpzdHJpbmcpIHtcbiAgICAgIHRoaXMud29ya2VyTmFtZSA9IHdvcmtlck5hbWU7XG4gICAgICB0aGlzLmpvYkxvZyA9IFtdO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gRGF0ZS5ub3coKTtcbiAgICB9XG5cbiAgICBkb25lKCkge1xuICAgICAgaWYgKHRoaXMuc3RvcHBlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gIFxuICAgICAgdGhpcy5zdG9wcGVkID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuZHVyYXRpb24gPSB0aGlzLnN0b3BwZWQgLSB0aGlzLnN0YXJ0ZWQ7XG4gICAgfVxufVxuICBcbmV4cG9ydCBkZWZhdWx0IFdvcmtlclN0YXR1cztcbiAgIl19