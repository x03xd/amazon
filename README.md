<h1>Amazon Clone</h1>
    
<h2>Technologies</h2>
<p>React + TypeScript + Django REST framework + Celery + RabbitMQ</p>

<h2>Running</h2>
<p>In the root folder:</p>

<ul>
  <li><code>python manage.py runserver</code> - Start the backend server</li>
  <li><code>celery -A amazon worker -l info -P eventlet</code> - Use this for background tasks on Windows</li>
  <li><code>celery -A amazon beat -l info</code> - Periodically call the currency API as defined in settings.py</li>
</ul>

<p>In the frontend folder:</p>
<ul>
  <li><code>npm start</code> - Start the frontend server</li>
</ul>

<p>start RabbitMQ server</p>

<p>Stripe Webhook Configuration</p>
<p>Install Stripe CLI:</p>
<ul>
    <li>Download from <a href="https://github.com/stripe/stripe-cli/releases/tag/v1.17.2">here</a> and extract.</li>
    <li>Run <code>stripe login</code> and follow the instructions.</li>
    <li>Run <code>stripe listen --forward-to http://127.0.0.1:8000/api/stripe-webhook/</code></li>
</ul>


<h2>Features</h2>
<ul>
  <li>Registration</li>
  <li>Login/Logout</li>
  <li>Product Filtering</li>
  <li>Ability to Purchase Products</li>
  <li>Shopping Cart</li>
  <li>Order Preview and Ability to Rate Ordered Products</li>
  <li>Currency Change</li>
  <li>Background Task in the Form of an API That Once, and Then at Specified Intervals in settings.py Using Celery, Updates Currency Exchange Rates</li>
  <li>User Data Editing</li>
  <li>Recommendations</li>
  <li>Review System</li>
  <li>Payment System with Stripe Payment and Webhooks Controlling Operations on the Database</li>
</ul>

<h2>Public API</h2>
<ul>
  <li>
    <span>Currency Exchange API</span>
    <a href="https://fixer.io/documentation">here</a>
  </li>
  
  <li>
    <span>Payment Gateaway</span>
    <a href="https://stripe.com/docs/checkout/quickstart">here</a>
  </li>
</ul>





