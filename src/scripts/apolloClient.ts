import { ApolloClient, InMemoryCache } from "@apollo/client/core"
import { ApolloLink } from "@apollo/client/link/core"
import { createUploadLink } from "apollo-upload-client"

const authLink = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const accessToken = localStorage.getItem("access_token")
	operation.setContext({
		headers: {
			Authorization: accessToken ? `Bearer ${accessToken}` : "",
		},
	})
	return forward(operation)
})

// HTTP connection to the API
const httpLink = createUploadLink({
	// You should use an absolute URL here
	uri: "http://localhost:8080/query",
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache,
})

export default apolloClient
