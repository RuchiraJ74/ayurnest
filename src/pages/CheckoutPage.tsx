import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Info, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

type PaymentMethod = 'card' | 'upi' | 'cod';
type CheckoutStep = 'address' | 'payment' | 'review' | 'confirmation';

interface Address {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const validateAddress = () => {
    const required = ['fullName', 'phoneNumber', 'addressLine1', 'city', 'state', 'pincode'];
    const missing = required.filter(field => !address[field as keyof Address]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(address.phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(address.pincode)) {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        toast({
          title: "Missing card information",
          description: "Please enter all card details.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive"
        });
        return false;
      }
      
      if (!/^\d{3}$/.test(cardCvv)) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3-digit CVV.",
          variant: "destructive"
        });
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        toast({
          title: "Missing UPI ID",
          description: "Please enter your UPI ID.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., name@upi).",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleContinue = () => {
    if (currentStep === 'address') {
      if (validateAddress()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      if (paymentMethod === 'cod' || validatePayment()) {
        setCurrentStep('review');
      }
    } else if (currentStep === 'review') {
      handlePlaceOrder();
    }
  };
  
  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('address');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    } else if (currentStep === 'confirmation') {
      navigate('/home');
    }
  };
  
  const handlePlaceOrder = () => {
    setLoading(true);
    
    const newOrderId = 'AYR-' + Math.floor(10000 + Math.random() * 90000);
    setOrderId(newOrderId);
    
    setTimeout(() => {
      clearCart();
      setCurrentStep('confirmation');
      setLoading(false);
      
      const order = {
        id: newOrderId,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        totalPrice: totalPrice,
        shippingPrice: 5.99,
        tax: (totalPrice * 0.07),
        grandTotal: (totalPrice + 5.99 + totalPrice * 0.07),
        address: address,
        paymentMethod: paymentMethod,
        status: 'processing',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('ayurnest_orders') || '[]');
      localStorage.setItem('ayurnest_orders', JSON.stringify([order, ...existingOrders]));
    }, 2000);
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };
  
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setCardExpiry(value);
  };
  
  const renderAddressForm = () => (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Delivery Address</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={address.fullName}
              onChange={(e) => handleAddressChange('fullName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              placeholder="10-digit mobile number"
              value={address.phoneNumber}
              onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
              maxLength={10}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input
            id="addressLine1"
            placeholder="House/Flat/Block No., Street"
            value={address.addressLine1}
            onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            placeholder="Landmark, Area (Optional)"
            value={address.addressLine2}
            onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="City"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              placeholder="State"
              value={address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            placeholder="6-digit pincode"
            value={address.pincode}
            onChange={(e) => handleAddressChange('pincode', e.target.value)}
            maxLength={6}
          />
        </div>
      </div>
    </Card>
  );
  
  const renderPaymentMethods = () => (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Payment Method</h2>
      
      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 ${paymentMethod === 'card' ? 'border-ayur-primary bg-ayur-light/10' : 'border-gray-200'}`}>
            <div className="flex items-start">
              <RadioGroupItem value="card" id="card" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label htmlFor="card" className="font-medium flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" /> Credit/Debit Card
                </Label>
                
                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          maxLength={3}
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className={`border rounded-lg p-4 ${paymentMethod === 'upi' ? 'border-ayur-primary bg-ayur-light/10' : 'border-gray-200'}`}>
            <div className="flex items-start">
              <RadioGroupItem value="upi" id="upi" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label htmlFor="upi" className="font-medium flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" /> UPI (PhonePe, Google Pay, etc.)
                </Label>
                
                {paymentMethod === 'upi' && (
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="name@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className={`border rounded-lg p-4 ${paymentMethod === 'cod' ? 'border-ayur-primary bg-ayur-light/10' : 'border-gray-200'}`}>
            <div className="flex items-start">
              <RadioGroupItem value="cod" id="cod" className="mt-1" />
              <div className="ml-3">
                <Label htmlFor="cod" className="font-medium flex items-center">
                  <Banknote className="mr-2 h-5 w-5" /> Cash on Delivery
                </Label>
                <p className="text-sm text-gray-500 mt-1">Pay when your order is delivered</p>
              </div>
            </div>
          </div>
        </div>
      </RadioGroup>
    </Card>
  );
  
  const renderOrderSummary = (detailed: boolean = false) => (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      
      {detailed && (
        <div className="space-y-4 mb-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>$5.99</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (7%)</span>
          <span>${(totalPrice * 0.07).toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-ayur-primary">
            ${(totalPrice + 5.99 + totalPrice * 0.07).toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
  
  const renderOrderReview = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Delivery Address</h2>
        <div className="space-y-1">
          <p className="font-medium">{address.fullName}</p>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}, {address.state} {address.pincode}</p>
          <p>Phone: {address.phoneNumber}</p>
        </div>
        <Button 
          variant="link" 
          className="p-0 h-auto mt-2 text-ayur-primary"
          onClick={() => setCurrentStep('address')}
        >
          Change
        </Button>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Payment Method</h2>
        <div className="flex items-center">
          {paymentMethod === 'card' && <CreditCard className="mr-2 h-5 w-5" />}
          {paymentMethod === 'upi' && <Smartphone className="mr-2 h-5 w-5" />}
          {paymentMethod === 'cod' && <Banknote className="mr-2 h-5 w-5" />}
          
          <span>
            {paymentMethod === 'card' && 'Credit/Debit Card'}
            {paymentMethod === 'upi' && 'UPI Payment'}
            {paymentMethod === 'cod' && 'Cash on Delivery'}
          </span>
        </div>
        {paymentMethod === 'card' && (
          <p className="mt-1 text-sm">Card ending with {cardNumber.slice(-4)}</p>
        )}
        {paymentMethod === 'upi' && (
          <p className="mt-1 text-sm">UPI ID: {upiId}</p>
        )}
        <Button 
          variant="link" 
          className="p-0 h-auto mt-2 text-ayur-primary"
          onClick={() => setCurrentStep('payment')}
        >
          Change
        </Button>
      </Card>
      
      {renderOrderSummary(true)}
    </div>
  );
  
  const renderOrderConfirmation = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-6"
    >
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">Thank you for your order. We've received your request.</p>
      </div>
      
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="font-medium mb-4">Order Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${(totalPrice + 5.99 + totalPrice * 0.07).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">
              {paymentMethod === 'card' && 'Credit/Debit Card'}
              {paymentMethod === 'upi' && 'UPI Payment'}
              {paymentMethod === 'cod' && 'Cash on Delivery'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Delivery:</span>
            <span className="font-medium">
              {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
                'en-US', { weekday: 'short', month: 'short', day: 'numeric' }
              )}
            </span>
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col space-y-3">
        <Button
          onClick={() => navigate('/order-tracking')}
          className="ayur-button"
        >
          Track Order
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </div>
    </motion.div>
  );
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      {currentStep !== 'confirmation' && (
        <>
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={handleBack}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Checkout</h1>
          </div>
          
          <div className="flex mb-6">
            <div className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                currentStep === 'address' ? 'bg-ayur-primary text-white' : 
                (currentStep === 'payment' || currentStep === 'review') ? 'bg-green-100 text-green-600' : 'bg-gray-200'
              }`}>
                {(currentStep === 'payment' || currentStep === 'review') ? (
                  <CheckCircle size={16} />
                ) : (
                  <span>1</span>
                )}
              </div>
              <span className="text-xs">Address</span>
            </div>
            <div className="w-full flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${
                (currentStep === 'payment' || currentStep === 'review') ? 'bg-green-100' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                currentStep === 'payment' ? 'bg-ayur-primary text-white' : 
                currentStep === 'review' ? 'bg-green-100 text-green-600' : 'bg-gray-200'
              }`}>
                {currentStep === 'review' ? (
                  <CheckCircle size={16} />
                ) : (
                  <span>2</span>
                )}
              </div>
              <span className="text-xs">Payment</span>
            </div>
            <div className="w-full flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${
                currentStep === 'review' ? 'bg-green-100' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                currentStep === 'review' ? 'bg-ayur-primary text-white' : 'bg-gray-200'
              }`}>
                <span>3</span>
              </div>
              <span className="text-xs">Review</span>
            </div>
          </div>
        </>
      )}
      
      <div className="space-y-6">
        {currentStep === 'address' && (
          <>
            {renderAddressForm()}
            {renderOrderSummary()}
          </>
        )}
        
        {currentStep === 'payment' && (
          <>
            {renderPaymentMethods()}
            {renderOrderSummary()}
          </>
        )}
        
        {currentStep === 'review' && renderOrderReview()}
        
        {currentStep === 'confirmation' && renderOrderConfirmation()}
        
        {(currentStep !== 'confirmation') && (
          <Button 
            className="w-full ayur-button py-6" 
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? "Processing..." : (
              currentStep === 'review' ? "Place Order" : "Continue"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
