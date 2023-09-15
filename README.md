<h1>Amazon Clone</h1>
    
<h2>Technologies</h2>
<p>React + TypeScript + Django REST framework + Celery + RabbitMQ</p>

<h2>Running</h2>
<p>In the root folder:</p>


<ul>
  <li><code>docker-compose up</code></li>
  <li>If the backend localhost is not working, try reloading the backend service. This is a common issue caused by the backend server starting before the message broker has finished.
  </li>

  <li><code>docker-compose restart backend</code></li>

  <li>The backend server is defined on port 8000.</li>
  <li>The frontend server is defined on port 3000.</li>
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





