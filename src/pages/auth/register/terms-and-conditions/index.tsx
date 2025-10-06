import { FC, useState } from "react"
import { ScrollView, Text, ToastAndroid, View } from "react-native"
import CheckBox from '@react-native-community/checkbox';
import Components from "../../../../components"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../../../tailwind.config"
import { acceptSNKRequest } from "../../../../services/auth/register";

const { theme } = resolveConfig(tailwindConfig)

interface TermsAndConditionInterface {
    navigation: any,
    route: any
}

const TermsAndCondition: FC<TermsAndConditionInterface> = ({ navigation, route }) => {
    const { isRegister } = route.params
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [loading, setLoading] = useState(false)

    const pressRegister = async () => {
        setLoading(true)
        try {
            await acceptSNKRequest()
            navigation.navigate("ListChat")

        } catch (error) {
            ToastAndroid.show("Gagal menyetujui syarat dan ketentuan !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 px-4">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="font-satoshi text-md text-black">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto veniam mollitia autem, iusto ipsa eligendi nostrum a nulla quasi, aliquid quisquam, placeat ducimus perferendis cupiditate quis provident harum ipsam quidem incidunt iure voluptatem? Accusantium dolore numquam cumque, unde eius blanditiis similique a dolorum architecto sequi necessitatibus delectus recusandae veniam hic cupiditate id laudantium, nesciunt rem. Id ipsam corrupti fugit, facilis ipsum facere sint deleniti tenetur explicabo inventore. Ipsa debitis, voluptatibus facilis reiciendis ipsum quis modi, amet optio quae eius veniam! Eum sit eaque quidem eos. Ipsam libero ex quisquam adipisci cum omnis corporis maxime, magni ratione corrupti modi ea, possimus soluta doloremque suscipit facere eveniet nostrum. Nesciunt quisquam aperiam deserunt et ipsa libero unde cumque voluptatem molestias sint facilis ratione ipsum adipisci in quam aspernatur obcaecati perferendis explicabo consectetur nihil, neque impedit. Sint tenetur repudiandae impedit suscipit corrupti nulla ipsum quis nam neque, ea quasi temporibus dolorem aspernatur perferendis ducimus voluptatibus, quibusdam incidunt perspiciatis praesentium quaerat maxime itaque necessitatibus maiores? Aliquam a ratione, tenetur vitae fuga facilis maiores omnis nesciunt error, deserunt illum quia, vel amet non? Quos in rem optio tempore cum sequi, harum odit blanditiis nihil distinctio amet, labore voluptate id! Iste nulla dolorum repellat, maiores a magni neque quod facilis impedit quidem ea voluptates odio voluptatum nemo atque nobis earum porro molestias laborum eaque reprehenderit eum similique sequi nostrum! Voluptates ducimus numquam enim accusantium earum atque fuga hic, et necessitatibus repudiandae quam tenetur amet harum minima sed iste maiores itaque vitae natus. Mollitia illo a aspernatur, quis dolor, eligendi aut recusandae optio harum autem voluptatum omnis, officiis modi cupiditate minus ipsa facere. Maxime assumenda recusandae excepturi et sequi praesentium temporibus, cumque amet itaque nostrum consequuntur? In distinctio odio perferendis ex, iste sapiente repellat omnis aspernatur quidem porro corporis, blanditiis ullam quae, quas animi nisi consequatur? Dicta nihil repellat magnam perferendis consectetur et, eum illo quos, ea consequatur sequi itaque doloremque eos molestiae impedit, quibusdam minus assumenda corrupti. Totam nesciunt error fugit eum dolorem non facere, unde maxime minus sequi dignissimos esse atque adipisci iste quos nihil in culpa animi doloremque ipsum fuga autem rem earum? Quas nobis accusamus soluta fuga, quibusdam omnis ducimus accusantium alias. Dicta perferendis eos a tempore corporis molestias aliquam nisi, est obcaecati quae laboriosam nostrum cumque inventore corrupti sint amet consequatur dolores. Error voluptatem rem, earum incidunt sequi soluta. Doloribus ut, voluptates voluptatem cum natus eos aspernatur et odio aperiam minus commodi vel voluptatibus assumenda facere totam officia praesentium ipsum harum architecto possimus. Minus, alias magnam. Minus ab, blanditiis assumenda vitae non facilis aspernatur deserunt temporibus suscipit quae provident rem omnis nisi quasi accusantium consequatur dolor officia iste voluptatum nam? Beatae quisquam laudantium quod ea molestiae officiis esse, distinctio incidunt id vero cum optio expedita labore pariatur necessitatibus reiciendis ab obcaecati. Magni dolor a quod labore, aspernatur quo est. Atque et magnam nam cumque esse, delectus error fugiat deserunt, eaque praesentium officia ipsam necessitatibus incidunt laborum similique nemo nulla! Asperiores vero iste commodi? Obcaecati quisquam aliquam sequi est blanditiis saepe sed officiis voluptatem deserunt, doloremque quaerat nisi sunt, nam vero earum quibusdam nulla corporis. Ipsa itaque omnis ullam quas, quisquam vitae enim hic ab tenetur expedita temporibus, culpa consequuntur beatae numquam! Commodi numquam totam ut dolorem accusantium! Nulla, quisquam possimus amet natus neque laudantium vitae nemo nam fuga ratione. Non quaerat a quisquam beatae corrupti mollitia. Nulla temporibus libero eveniet voluptatum? Sequi fugit similique iure? Quae numquam, quo temporibus repellendus sit libero dolore atque culpa non aspernatur? Ipsam aut illo porro esse eos, asperiores sapiente voluptas tenetur suscipit qui a placeat, culpa impedit voluptatem iste? Laborum voluptatum, magnam accusantium nihil dolores quaerat. Doloribus laboriosam eveniet optio asperiores consectetur assumenda obcaecati minima ipsam fugit, voluptatibus tenetur sunt fuga praesentium et repellendus aut tempora adipisci velit consequatur fugiat! Explicabo, aperiam autem! Esse odio accusamus explicabo tenetur. In, ab? Aliquam inventore minima id aut fuga doloremque quas molestiae blanditiis laborum sint mollitia provident dolorum enim atque aliquid nisi, voluptates sunt voluptatum quidem earum eum. Laboriosam architecto enim ratione a commodi velit maiores, delectus aliquid, quisquam similique expedita perferendis aperiam sint! Distinctio ab a sunt quo temporibus, reprehenderit facere quae. Quis voluptatem, ullam officia reprehenderit itaque a vitae alias ex voluptas. Ab modi corrupti eius, non, a voluptatem repellat ea quidem reprehenderit optio sapiente alias voluptatum, consectetur recusandae ipsum delectus dolorum aliquid enim quisquam mollitia hic itaque necessitatibus? Aut, esse iusto. Magnam sint, voluptatibus illo facere debitis ducimus placeat sapiente blanditiis nostrum inventore fuga mollitia totam cum beatae molestiae maiores illum iusto porro et eum optio officiis expedita libero exercitationem? Temporibus ab deleniti minus vero illo quidem nemo, iusto esse quis eaque, obcaecati minima ullam rerum excepturi omnis sequi laudantium. Impedit iure facilis quidem quam harum maxime aut placeat laudantium voluptates. Cum repudiandae alias quae numquam aperiam at quos provident eligendi nesciunt. Ut esse ad animi aperiam iure praesentium, repellat maxime commodi quaerat! Minus ipsum nam magni dolores voluptatum veniam, autem dolorum dicta eligendi reprehenderit, earum tempore porro recusandae maiores aut. Quam quibusdam dolore nostrum hic corporis eius, molestias obcaecati exercitationem! Eos facilis quos exercitationem magnam vel minima similique dicta quibusdam possimus sint impedit magni voluptates doloremque ut sapiente ab recusandae voluptatum quia velit adipisci, beatae ratione iusto ad. Soluta quidem magni maiores quae velit libero cupiditate quisquam quam doloremque voluptates, culpa eaque quo tenetur amet animi cum quos aperiam minus molestias aspernatur nulla accusantium vitae. Cumque, quibusdam repellendus? Sunt, totam vero ipsa, reprehenderit repudiandae expedita esse ipsam provident architecto sit consequatur non. Molestiae provident ut consequuntur quae neque, repudiandae cumque facere fugiat voluptatem quaerat quis, officia dolor qui perspiciatis, temporibus optio vero illo vitae corrupti. Delectus, amet tenetur consequatur reiciendis illum vitae accusantium excepturi dolorem laudantium? Neque similique est ullam quaerat necessitatibus, non, porro cum culpa blanditiis adipisci, error laborum. Enim ex quo iure amet nostrum! Nemo consequatur, facilis possimus ipsa id rem ipsum est amet animi ducimus maiores minima? Dolorum nostrum debitis qui tenetur fuga aspernatur fugiat error, nam commodi cumque quae pariatur quia similique? Cumque omnis, in dolorum veniam id minima cupiditate exercitationem repudiandae?</Text>
                </ScrollView>
            </View>

            {
                isRegister &&
                <View className="py-3 border-t border-t-gray-100 px-4">
                    <View className="items-center flex-row">
                        <View className="w-1/12">
                            <CheckBox
                                boxType="square"
                                tintColors={{ true: theme?.colors!.primary as string }}
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                        </View>
                        <View className="w-11/12 pl-2">
                            <Text className="font-satoshi text-md text-black">Saya telah membaca dan menyetujui Syarat & Ketentuan diatas</Text>
                        </View>
                    </View>
                    <View className="mt-3">
                        <Components.Button
                            isDisabled={toggleCheckBox ? false : true}
                            label="Daftar"
                            onPress={pressRegister}
                            loading={loading}
                        />
                    </View>
                </View>
            }
        </View>
    )
}

export default TermsAndCondition