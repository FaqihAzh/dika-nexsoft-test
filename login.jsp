<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%> <% String errorMessage = request.getParameter("error");
%>
<!DOCTYPE html>
<html>
  <head>
    <title>Login Page</title>
  </head>
  <body>
    <h2>Login</h2>
    <form action="login.jsp" method="post">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" />
      <br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" />
      <br />
      <button type="submit">Login</button>
    </form>

    <% if (errorMessage != null) { %>
    <p style="color: red"><%= errorMessage %></p>
    <% } %>
  </body>
</html>
