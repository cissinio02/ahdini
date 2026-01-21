import React, { useState } from 'react';
import styles from './RegisterVendor.module.css';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import authService from '../../Services/authService';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';
import { logo_blanc } from '../../assets/icons/icons';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';


export default function Register() {
    // States
    const [shopName, setShopName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
   
}