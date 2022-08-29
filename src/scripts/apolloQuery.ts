import gql from "graphql-tag"
import { useQuery, useMutation } from "../scripts/apolloUtils"
import { Course, Member } from "../scripts/interface"
import { Post, NewComment, Auth } from "./interface"
import type { UploadFileInfo } from "naive-ui"

export function useSelfInfoQuery() {
	return useQuery<{ selfInfo: Member }, Record<string, never>>(
		gql`
			{
				selfInfo {
					_id
					eamil
					isAdmin
					username
					nickname
					avatarPath
					courses
				}
			}
		`
	)
}

export function usePostsQuery() {
	return useQuery<{ posts: Post[] }, Record<string, never>>(
		gql`
			{
				posts {
					_id
					poster
					title
					year
					semester
					tags
					mdPath
					createTime
					lastModifyTime
				}
			}
		`
	)
}

export function useMembersQuery() {
	return useQuery<{ members: Member[] }, Record<string, never>>(
		gql`
			{
				members {
					_id
					username
					email
					isAdmin
					courses {
						name
					}
				}
			}
		`
	)
}

export function useIsAdminQuery() {
	return useQuery<{ isAdmin: boolean }, Record<string, never>>(
		gql`
			{
				isAdmin
			}
		`
	)
}

export function useSendResetPWDMutation() {
	return useMutation<{ sendResetPWD: boolean }, { email: string }>(
		gql`
			mutation ($email: String!) {
				sendResetPWD(email: $email)
			}
		`
	)
}

export function useResetPWDMutation() {
	return useMutation<{ sendResetPWD: boolean }, { pwd: string }>(
		gql`
			mutation ($pwd: String!) {
				resetPWD(password: $pwd)
			}
		`
	)
}

export function useAddPostMutation() {
	return useMutation<
		{ addPost: Post },
		{
			poster: string
			title: string
			year: number
			semester: number
			tags: string[]
			mdFile: UploadFileInfo
		}
	>(
		gql`
			mutation ($input: NewPost!) {
				addPost(input: $input) {
					_id
					poster
					title
					year
					semester
					tags
					mdPath
					createTime
					lastModifyTime
				}
			}
		`
	)
}

export function useRemovePostMutation() {
	return useMutation<{ removePost: Post }, { id: string }>(
		gql`
			mutation ($id: String!) {
				removePost(id: $id) {
					_id
					poster
					title
					year
					semester
					tags
					mdPath
					createTime
					lastModifyTime
				}
			}
		`
	)
}

export function useCreateMemberMutation() {
	return useMutation<
		{ createMember: Member },
		{ email: string; password: string; isAdmin: boolean; courses: Course[] }
	>(
		gql`
			mutation (
				$email: String!
				$password: String!
				$isAdmin: Boolean!
				$courses: [NewCourse!]!
			) {
				createMember(
					input: {
						email: $email
						password: $password
						isAdmin: $isAdmin
						courses: $courses
					}
				) {
					username
				}
			}
		`
	)
}

export function useRemoveMemberMutation() {
	return useMutation<{ removeMember: Member }, { id: string }>(
		gql`
			mutation ($id: String!) {
				removeMember(id: $id) {
					username
					email
				}
			}
		`
	)
}

export function useUpdateMemberIsAdminMutation() {
	return useMutation<{ updateMemberIsAdmin: Member }, { id: string }>(
		gql`
			mutation ($id: String!) {
				updateMemberIsAdmin(id: $id)
			}
		`
	)
}

export function useUpdateCoursesMutation() {
	return useMutation<
		{ updateMemberCourses: Course[] },
		{ id: string; add: Course[]; remove: Course[] }
	>(
		gql`
			mutation ($id: String!, $add: [NewCourse!]!, $remove: [NewCourse!]!) {
				updateMemberCourses(id: $id, add: $add, remove: $remove) {
					name
				}
			}
		`
	)
}

export function useAddPostCommentMutation() {
	return useMutation<{ addPostComment: boolean }, { id: string; newComment: NewComment }>(
		gql`
			mutation ($id: String!, $newComment: NewComment!) {
				addPostComment(id: $id, newComment: $newComment)
			}
		`
	)
}

export function useDeletePostCommentMutation() {
	return useMutation<
		{ deletePostComment: boolean },
		{ id: string; mainLevel: number; subLevel: number }
	>(
		gql`
			mutation ($id: String!, $mainLevel: Int!, $subLevel: Int!) {
				deletePostComment(id: $id, mainLevel: $mainLevel, subLevel: $subLevel)
			}
		`
	)
}

export function useLoginCheckMutation() {
	useMutation<{ loginCheck: Auth }, { email: string; password: string }>(
		gql`
			mutation loginCheck($email: String!, $password: String!) {
				loginCheck(input: { email: $email, password: $password }) {
					token
					state
				}
			}
		`
	)
}
