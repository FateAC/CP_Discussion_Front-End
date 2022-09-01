import { CourseTime, Course } from "./interface"

export const parseCourseTimeToCourse = (courseTime: CourseTime): Course => {
	const year = courseTime.year + 1911 + courseTime.semester
	const semester =
		courseTime.semester == 0 ? "Fall" : courseTime.semester == 1 ? "Spring" : "Undefined"
	return { name: year + "_" + semester }
}

export const parseCourseToCourseTime = (course: Course): CourseTime => {
	const part = course.name.split("_")
	const semester = part[1] == "Fall" ? 0 : part[1] == "Spring" ? 1 : NaN
	const year = Number(part[0]) - 1911 - semester
	return { year: year, semester: semester }
}
