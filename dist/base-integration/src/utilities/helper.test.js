"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const helper_1 = require("./helper");
(0, globals_1.describe)('running-test', () => {
    (0, globals_1.describe)('csvContentChecker', () => {
        (0, globals_1.it)('should encode quotes', async () => {
            const content = `hello "big" world`;
            const encoded = helper_1.Helper.csvContentChecker(content);
            (0, globals_1.expect)(encoded).toBe(`"hello ""big"" world"`);
        });
        (0, globals_1.it)('should encode commas', async () => {
            const content = `hello, or not`;
            const encoded = helper_1.Helper.csvContentChecker(content);
            (0, globals_1.expect)(encoded).toBe(`"hello, or not"`);
        });
        (0, globals_1.it)('should encode both quotes and commas', async () => {
            const content = `h "and," or something else, or "not"`;
            const encoded = helper_1.Helper.csvContentChecker(content);
            (0, globals_1.expect)(encoded).toBe(`"h ""and,"" or something else, or ""not"""`);
        });
        (0, globals_1.it)('should return normal text', async () => {
            const content = `hello world`;
            const encoded = helper_1.Helper.csvContentChecker(content);
            (0, globals_1.expect)(encoded).toBe(`hello world`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy91dGlsaXRpZXMvaGVscGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FJdUI7QUFDdkIscUNBQWtDO0FBRWxDLElBQUEsa0JBQVEsRUFBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLElBQUEsa0JBQVEsRUFBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsSUFBQSxZQUFFLEVBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEMsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7WUFDcEMsTUFBTSxPQUFPLEdBQUcsZUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELElBQUEsZ0JBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUEsWUFBRSxFQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3BDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQztZQUNoQyxNQUFNLE9BQU8sR0FBRyxlQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEQsSUFBQSxnQkFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBQSxZQUFFLEVBQUMsc0NBQXNDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEQsTUFBTSxPQUFPLEdBQUcsc0NBQXNDLENBQUM7WUFDdkQsTUFBTSxPQUFPLEdBQUcsZUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELElBQUEsZ0JBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUEsWUFBRSxFQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxlQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEQsSUFBQSxnQkFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBkZXNjcmliZSxcbiAgaXQsXG4gIGV4cGVjdCxcbn0gZnJvbSAnQGplc3QvZ2xvYmFscyc7XG5pbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuL2hlbHBlcic7XG5cbmRlc2NyaWJlKCdydW5uaW5nLXRlc3QnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdjc3ZDb250ZW50Q2hlY2tlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGVuY29kZSBxdW90ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYGhlbGxvIFwiYmlnXCIgd29ybGRgO1xuICAgICAgY29uc3QgZW5jb2RlZCA9IEhlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihjb250ZW50KTtcbiAgICAgIGV4cGVjdChlbmNvZGVkKS50b0JlKGBcImhlbGxvIFwiXCJiaWdcIlwiIHdvcmxkXCJgKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGVuY29kZSBjb21tYXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYGhlbGxvLCBvciBub3RgO1xuICAgICAgY29uc3QgZW5jb2RlZCA9IEhlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihjb250ZW50KTtcbiAgICAgIGV4cGVjdChlbmNvZGVkKS50b0JlKGBcImhlbGxvLCBvciBub3RcImApO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgZW5jb2RlIGJvdGggcXVvdGVzIGFuZCBjb21tYXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYGggXCJhbmQsXCIgb3Igc29tZXRoaW5nIGVsc2UsIG9yIFwibm90XCJgO1xuICAgICAgY29uc3QgZW5jb2RlZCA9IEhlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihjb250ZW50KTtcbiAgICAgIGV4cGVjdChlbmNvZGVkKS50b0JlKGBcImggXCJcImFuZCxcIlwiIG9yIHNvbWV0aGluZyBlbHNlLCBvciBcIlwibm90XCJcIlwiYCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm9ybWFsIHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYGhlbGxvIHdvcmxkYDtcbiAgICAgIGNvbnN0IGVuY29kZWQgPSBIZWxwZXIuY3N2Q29udGVudENoZWNrZXIoY29udGVudCk7XG4gICAgICBleHBlY3QoZW5jb2RlZCkudG9CZShgaGVsbG8gd29ybGRgKTtcbiAgICB9KTtcbiAgfSlcbn0pXG4iXX0=