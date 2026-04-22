import { Bookmark, Globe, Mail, Plus, Search, Settings, Trash2 } from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet, type BottomSheetRef } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/ToastProvider';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';
import { type Theme } from '@/stores/themeStore';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Typography variant="h2" weight="bold">
        {title}
      </Typography>
      <View className="h-px bg-gray-200 dark:bg-gray-700" />
      {children}
    </View>
  );
}

export default function Showcase() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const sheetRef = useRef<BottomSheetRef>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNote, setModalNote] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const themes: Array<{ key: Theme; label: string }> = [
    { key: 'light', label: 'Açık' },
    { key: 'dark', label: 'Koyu' },
    { key: 'system', label: 'Sistem' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView contentContainerClassName="gap-6 p-6 pb-12">
        <Typography variant="h1" color="primary">
          UI Showcase
        </Typography>

        <Section title="Tema">
          <View className="flex-row gap-2">
            {themes.map((t) => (
              <View key={t.key} className="flex-1">
                <Button
                  variant={theme === t.key ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => setTheme(t.key)}
                >
                  {t.label}
                </Button>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Typography">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body">Body — varsayılan metin boyutu</Typography>
          <Typography variant="caption" color="muted">
            Caption — küçük, soluk
          </Typography>
          <View className="h-2" />
          <Typography weight="regular">Regular (400)</Typography>
          <Typography weight="medium">Medium (500)</Typography>
          <Typography weight="semibold">SemiBold (600)</Typography>
          <Typography weight="bold">Bold (700)</Typography>
          <View className="h-2" />
          <Typography color="primary">Primary renk</Typography>
          <Typography color="success">Success renk</Typography>
          <Typography color="danger">Danger renk</Typography>
          <Typography color="warning">Warning renk</Typography>
        </Section>

        <Section title="Buttons">
          <Button onPress={() => {}}>Primary</Button>
          <Button variant="secondary" onPress={() => {}}>
            Secondary
          </Button>
          <Button variant="ghost" onPress={() => {}}>
            Ghost
          </Button>
          <Button variant="danger" onPress={() => {}}>
            Danger
          </Button>
          <View className="flex-row gap-2">
            <Button size="sm" onPress={() => {}}>
              Small
            </Button>
            <Button size="md" onPress={() => {}}>
              Medium
            </Button>
            <Button size="lg" onPress={() => {}}>
              Large
            </Button>
          </View>
          <Button loading onPress={() => {}}>
            Loading
          </Button>
          <Button disabled onPress={() => {}}>
            Disabled
          </Button>
          <Button icon={<Plus size={18} color="white" />} onPress={() => {}}>
            İkonlu
          </Button>
          <Button fullWidth onPress={() => {}}>
            Full Width
          </Button>
        </Section>

        <Section title="IconButtons">
          <View className="flex-row items-center gap-2">
            <IconButton
              icon={<Plus size={20} color="white" />}
              onPress={() => {}}
              accessibilityLabel="Ekle"
            />
            <IconButton
              variant="secondary"
              icon={<Search size={20} color="#111827" />}
              onPress={() => {}}
              accessibilityLabel="Ara"
            />
            <IconButton
              variant="ghost"
              icon={<Mail size={20} color="#2563EB" />}
              onPress={() => {}}
              accessibilityLabel="Mesaj"
            />
            <IconButton
              variant="danger"
              icon={<Trash2 size={20} color="white" />}
              onPress={() => {}}
              accessibilityLabel="Sil"
            />
          </View>
        </Section>

        <Section title="Inputs">
          <Input
            label="E-posta"
            placeholder="ornek@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color="#6B7280" />}
          />
          <Input
            label="Şifre"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            helperText="En az 8 karakter"
          />
          <Input label="Hatalı alan" value="kötü değer" error="Bu alan geçersiz" />
          <Input placeholder="Ara..." leftIcon={<Search size={20} color="#6B7280" />} />
        </Section>

        <Section title="Badges">
          <View className="flex-row flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Başarılı</Badge>
            <Badge variant="danger">Hata</Badge>
            <Badge variant="warning">Uyarı</Badge>
            <Badge variant="info">Bilgi</Badge>
            <Badge variant="success" size="md">
              Medium
            </Badge>
          </View>
        </Section>

        <Section title="ProgressBars">
          <ProgressBar value={20} />
          <ProgressBar value={50} variant="success" />
          <ProgressBar value={75} variant="warning" />
          <ProgressBar value={95} variant="danger" />
        </Section>

        <Section title="Avatars">
          <View className="flex-row items-center gap-3">
            <Avatar name="Ali Yılmaz" size="sm" />
            <Avatar name="Eray Durukan" size="md" />
            <Avatar name="Mehmet" size="lg" />
            <Avatar source="https://i.pravatar.cc/150?img=12" name="Image User" size="lg" />
          </View>
        </Section>

        <Section title="Cards">
          <Card>
            <Typography variant="h3">Default Card</Typography>
            <Typography color="secondary">rounded-2xl + p-4</Typography>
          </Card>
          <Card bordered padding="sm">
            <Typography weight="medium">Bordered + sm padding</Typography>
          </Card>
          <Card onPress={() => showToast('Card tıklandı', 'info')}>
            <Typography weight="medium">Pressable Card (tıkla)</Typography>
          </Card>
        </Section>

        <Section title="Spinners">
          <View className="flex-row items-center gap-6">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </View>
        </Section>

        <Section title="Overlays">
          <Button onPress={() => setModalVisible(true)}>Modal Aç</Button>
          <Button variant="secondary" onPress={() => sheetRef.current?.present()}>
            BottomSheet Aç
          </Button>
        </Section>

        <Section title="Toast">
          <View className="flex-row flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onPress={() => showToast('Kayıt başarılı', 'success')}
            >
              Success
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => showToast('Bir hata oluştu', 'error')}
            >
              Error
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => showToast('Dikkat: bağlantı zayıf', 'warning')}
            >
              Warning
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => showToast('Yeni güncelleme mevcut', 'info')}
            >
              Info
            </Button>
          </View>
        </Section>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Örnek Modal"
      >
        <View className="gap-3">
          <Typography color="secondary">
            Klavye açıldığında modal kaymamalı. Backdrop'a dokun veya X'e bas.
          </Typography>
          <Input
            label="Not"
            placeholder="Bir şeyler yaz..."
            value={modalNote}
            onChangeText={setModalNote}
          />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button variant="secondary" onPress={() => setModalVisible(false)}>
                İptal
              </Button>
            </View>
            <View className="flex-1">
              <Button
                onPress={() => {
                  setModalVisible(false);
                  showToast('Kaydedildi', 'success');
                }}
              >
                Kaydet
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <BottomSheet ref={sheetRef} title="Kategori Seçin">
        {[
          { icon: Bookmark, label: 'Kayıtlılar' },
          { icon: Globe, label: 'Tüm Kategoriler' },
          { icon: Settings, label: 'Ayarlar' },
        ].map(({ icon: Icon, label }) => (
          <Pressable
            key={label}
            onPress={() => {
              sheetRef.current?.dismiss();
              showToast(`${label} seçildi`, 'info');
            }}
            className="flex-row items-center gap-3 rounded-xl px-3 py-4 active:bg-gray-100 dark:active:bg-gray-700"
          >
            <Icon size={22} color="#6B7280" />
            <Typography weight="medium">{label}</Typography>
          </Pressable>
        ))}
      </BottomSheet>
    </SafeAreaView>
  );
}
