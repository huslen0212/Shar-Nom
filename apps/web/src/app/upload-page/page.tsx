import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

async function submitYellowBook(formData: FormData) {
  'use server';

  //   const title = formData.get('title')
  //   const category = formData.get('category')
  //   const content = formData.get('content')
  //   const created = formData.get('created')
  //   const location = formData.get('location')
  //   const image = formData.get('image')

  //   //   console.log({
  //   //     title,
  //   //     category,
  //   //     content,
  //   //     created,
  //   //     location,
  //   //     image,
  //   //   })
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="ml-5 mt-4">
        <BackButton />
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <Card className="border-none bg-white rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Шинэ газар нэмэх</CardTitle>
            <CardDescription>
              Шар номд нэмэх мэдээллээ оруулна уу
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={submitYellowBook} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Гарчиг *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Жишээ нь: Төв Номын Сан"
                  required
                />
              </div>

              {/* Turul */}
              <div className="space-y-2">
                <Label htmlFor="category">Төрөл *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Төрөл сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="library">Номын сан</SelectItem>
                    <SelectItem value="museum">Музей</SelectItem>
                    <SelectItem value="hotel">Буудал</SelectItem>
                    <SelectItem value="restaurant">Хоолны газар</SelectItem>
                    <SelectItem value="shop">Дэлгүүр</SelectItem>
                    <SelectItem value="resort">Амралтын газар</SelectItem>
                    <SelectItem value="center">Төв</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tailbar */}
              <div className="space-y-2">
                <Label htmlFor="content">Тайлбар *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Дэлгэрэнгүй тайлбар бичнэ үү..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              {/* Uussen on */}
              <div className="space-y-2">
                <Label htmlFor="created">Үүссэн он *</Label>
                <Input
                  id="created"
                  name="created"
                  type="number"
                  placeholder="Жишээ нь: 1950"
                  min="1800"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              {/* Bairshil */}
              <div className="space-y-2">
                <Label htmlFor="location">Байршил *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Жишээ нь: Улаанбаатар, Сүхбаатар дүүрэг"
                  required
                />
              </div>

              {/* Zurag nemeh */}
              <div className="space-y-2">
                <Label htmlFor="image">Зураг *</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                />
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG форматтай зураг
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button type="submit" className="flex-1">
                  Хадгалах
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
