import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core"
import { ApolloLink } from "@apollo/client/link/core"

const authLink = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const token = localStorage.getItem("token")
	operation.setContext({
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	})
	return forward(operation)
})

// HTTP connection to the API
const httpLink = createHttpLink({
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
