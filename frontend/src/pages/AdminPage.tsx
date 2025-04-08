import AuthorizeView from '../components/AuthorizeView';

function AdminPage() {
  return (
    <AuthorizeView>
      <h1>Welcome, Admin!</h1>
    </AuthorizeView>
  );
}

export default AdminPage;
