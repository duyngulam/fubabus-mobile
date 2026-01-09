import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function SignIn() {
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      await signIn({ emailOrPhone: identifier, password, remember });
      router.replace('/');
    } catch (e: any) {
      setError(e?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setMode('phone')} style={[styles.tab, mode === 'phone' && styles.tabActive]}>
          <Text>Số điện thoại</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('email')} style={[styles.tab, mode === 'email' && styles.tabActive]}>
          <Text>Email</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{mode === 'phone' ? 'Số điện thoại' : 'Email'}</Text>
      <TextInput style={styles.input} placeholder={mode === 'phone' ? '0989...' : 'you@mail.com'} value={identifier} onChangeText={setIdentifier} keyboardType={mode==='phone' ? 'phone-pad' : 'email-address'} />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput style={styles.input} placeholder="••••••" value={password} onChangeText={setPassword} secureTextEntry />

      <View style={styles.row}>
        <TouchableOpacity onPress={() => setRemember(!remember)}>
          <Text>{remember ? '☑' : '☐'} Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={submit} disabled={isLoading}>
        <Text style={styles.btnText}>{isLoading ? 'Loading...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.link}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 12 },
  toggleRow: { flexDirection: 'row', alignSelf: 'center', marginVertical: 12 },
  tab: { padding: 10, borderRadius: 20, backgroundColor: '#f6f3ee', marginHorizontal: 6 },
  tabActive: { backgroundColor: '#efe6d8' },
  label: { marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
  forgot: { color: '#e06' },
  error: { color: 'red', marginTop: 8 },
  btn: { backgroundColor: '#d85', padding: 14, borderRadius: 12, marginTop: 18 },
  btnText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  link: { color: '#e06', marginLeft: 6 },
});
