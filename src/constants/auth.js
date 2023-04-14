export default function authHeader() {
    // return authorization header with basic auth credentials
    const user = JSON.parse(sessionStorage.getItem('userData'));
  
    if (user && user.token) {
        return { 'x-auth-token': user.token };
    } 
    return {};
}
