export interface Course {
	name: string
}

export interface Member {
	_id: string
	email: string
	username: string
	isAdmin: boolean
	nickname: string
	avatarPath: string
	courses: Course[]
}

export interface Post {
	_id: string
	poster: string
	title: string
	year: string
	semester: string
	tags: string[]
	mdPath: string
	createTime: string
	lastModifyTime: string
	comments: Comment[]
}

export interface NewPost {
	poster: string
	title: string
	year: number
	semester: number
	tags: string[]
	mdFile: File
}

export interface Comment {
	commenter: string
	content: string
	mainLevel: number
	subLevel: number
	timestamp: Date
	deleted: boolean
}

export interface NewComment {
	content: string
	mainLevel: number
	subLevel: number
}

export interface Auth {
	token: string
	state: boolean
}
