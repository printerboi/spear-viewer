#include "include/Camera.h"
#include "include/Sphere.h"
#include "include/hitable_list.h"

const double pi = 3.1415926535897932385;


inline double degrees_to_radians(double degrees) {
    return degrees * pi / 180.0;
}


int main()
{

    double aspect_ratio = 16.0 / 9.0;
    int width = 400;
    vec3 camera_center = vec3(0, 0, 0);

    hittable_list world;

    world.add(make_shared<Sphere>(point3(0,0,-1), 0.5));
    world.add(make_shared<Sphere>(point3(0,-100.5,-1), 100));

    Camera camera = Camera(width, aspect_ratio, camera_center);



    std::cout << "P3\n" << camera.get_width() << " " << camera.get_height() << "\n255\n";

    for(int y = 0; y < camera.get_height(); y++) {
        std::clog << "\rProgress: (" << y+1 << "/" << camera.get_height() << ")" << std::flush;
        for(int x = 0; x < camera.get_width(); x++) {
            double redChannel = (double) x / (width - 1);
            double greenChannel = (double) y / (width - 1);
            double blueChannel = (double) (y+x) / (width - 1);

            auto pixel_color = camera.construct_ray_for_pixel(y, x).getColor(world);
            write_color(std::cout, pixel_color);

            //std::cout << redValue << " " << greenValue << " " << blueValue << std::endl;
        }
    }

    std::clog << "\rFinished.                   \n";

    vec3(0, 0, 0);

    return 0;
}
